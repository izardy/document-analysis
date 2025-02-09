import { BedrockAgentClient } from "@aws-sdk/client-bedrock-agent";
import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime"; // ES Modules import
import { fromEnv } from "@aws-sdk/credential-providers";

const config = {
  region: process.env.AWS_REGION || "", // AWS region where Bedrock is available
  credentials: fromEnv(), // Use environment variables for AWS credentials
  maxAttempts: 3,
};

export const clientBedrockAgent = new BedrockAgentRuntimeClient(config);
export const client = new BedrockAgentClient(config);
