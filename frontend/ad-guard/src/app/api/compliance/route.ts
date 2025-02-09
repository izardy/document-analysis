import { NextRequest, NextResponse } from "next/server";
import { invokeAgentAndStream } from "@/server/aws/BedrockAgents";

function createStream(readable: ReadableStream) {
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const agentId = "OWTCLJJVSN";
    const agentAliasId = "VHZKWGOD3I";
    const inputText = "Hello, invoke bedrock agent";

    const stream = await invokeAgentAndStream({
      agentId,
      agentAliasId,
      inputText,
    });

    if (!stream) {
      return new NextResponse("Error invoking agent", { status: 500 });
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
