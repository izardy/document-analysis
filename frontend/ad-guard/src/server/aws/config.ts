import { BedrockAgentClient } from "@aws-sdk/client-bedrock-agent"; // ES Modules import

const config = {
  region: process.env.AWS_REGION || "", // AWS region where Bedrock is available
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // AWS access key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // AWS secret access key
  },
};

export const client = new BedrockAgentClient(config);
