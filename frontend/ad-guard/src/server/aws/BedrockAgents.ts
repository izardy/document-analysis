import { client, clientBedrockAgent } from "./config";
import {
  GetAgentCommand,
  ListAgentsCommand,
} from "@aws-sdk/client-bedrock-agent";

import { InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const getBedrockAgentByID = async (agentId: string) => {
  const command = new GetAgentCommand({ agentId });
  const response = await client.send(command);
  return response;
};

const getAllBedrockAgents = async () => {
  const command = new ListAgentsCommand({
    // ListBedrockAgentsRequest
    maxResults: 10,
    nextToken: undefined,
  });
  const response = await client.send(command);
  return response;
};

// Helper function to create a streaming response

interface InvokeAgentAndStreamParams {
  inputText: string;
  agentId: string;
  agentAliasId: string;
  sessionId?: string;
}

const invokeAgentAndStream = async ({
  inputText,
  agentId,
  agentAliasId,
  sessionId = "bedrock-session-id",
}: InvokeAgentAndStreamParams) => {
  // Create a TransformStream to handle the streaming
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Start the streaming process
  try {
    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId,
      sessionId,
      inputText,
      enableTrace: true,
    });

    const response = await clientBedrockAgent.send(command);

    if (!response.completion) {
      throw new Error("No completion stream in response");
    }

    // Process the stream
    (async () => {
      try {
        if (!response.completion) {
          throw new Error("No completion available in response");
        }
        for await (const event of response.completion) {
          // Handle chunk data
          if (event.chunk?.bytes) {
            const textDecoder = new TextDecoder();
            const text = textDecoder.decode(event.chunk.bytes);
            // Send the chunk as a Server-Sent Event
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({ type: "chunk", content: text })}\n\n`,
              ),
            );
          }

          // Handle trace data
          if (event.trace) {
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({ type: "trace", content: event.trace })}\n\n`,
              ),
            );
          }
        }
      } catch (error) {
        // Send error event
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", content: errorMessage })}\n\n`,
          ),
        );
      } finally {
        await writer.close();
      }
    })();

    // Return the streaming response
    return stream.readable;
  } catch (error) {
    // Handle initial setup errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    await writer.write(
      encoder.encode(
        `data: ${JSON.stringify({ type: "error", content: errorMessage })}\n\n`,
      ),
    );
    await writer.close();
    return stream.readable;
  }
};

export { getBedrockAgentByID, getAllBedrockAgents, invokeAgentAndStream };
