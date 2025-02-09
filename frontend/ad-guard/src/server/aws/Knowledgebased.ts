import {
  GetKnowledgeBaseCommand,
  ListKnowledgeBaseDocumentsCommand,
  ListKnowledgeBasesCommand,
} from "@aws-sdk/client-bedrock-agent";
import { client } from "./config";

const getKnowledgeBaseByID = async () => {
  const input = {
    // GetKnowledgeBaseRequest
    knowledgeBaseId: "STRING_VALUE", // required
  };
  const command = new GetKnowledgeBaseCommand(input);
  const response = await client.send(command);
  return response;
};

const getAllKnowledgeBases = async () => {
  const input = {
    // ListKnowledgeBasesRequest
    maxResults: Number("int"),
    nextToken: undefined,
  };

  const command = new ListKnowledgeBasesCommand(input);
  const response = await client.send(command);
  return response;
};

const getKnowledgeBaseDocumentsByID = async (
  knowledgeBaseId: string,
  dataSourceId: string,
) => {
  const command = new ListKnowledgeBaseDocumentsCommand({
    knowledgeBaseId,
    dataSourceId,
  });
  const response = await client.send(command);
  return response;
};

export {
  getKnowledgeBaseByID,
  getAllKnowledgeBases,
  getKnowledgeBaseDocumentsByID,
};
