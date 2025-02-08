import {
  GetKnowledgeBaseCommand,
  ListKnowledgeBaseDocumentsCommand,
  ListKnowledgeBasesCommand,
} from "@aws-sdk/client-bedrock-agent"; // ES Modules import
// const { BedrockAgentClient, GetKnowledgeBaseCommand } = require("@aws-sdk/client-bedrock-agent"); // CommonJS import
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

// { // GetKnowledgeBaseResponse
//   knowledgeBase: { // KnowledgeBase
//     knowledgeBaseId: "STRING_VALUE", // required
//     name: "STRING_VALUE", // required
//     knowledgeBaseArn: "STRING_VALUE", // required
//     description: "STRING_VALUE",
//     roleArn: "STRING_VALUE", // required
//     knowledgeBaseConfiguration: { // KnowledgeBaseConfiguration
//       type: "VECTOR" || "KENDRA" || "SQL", // required
//       vectorKnowledgeBaseConfiguration: { // VectorKnowledgeBaseConfiguration
//         embeddingModelArn: "STRING_VALUE", // required
//         embeddingModelConfiguration: { // EmbeddingModelConfiguration
//           bedrockEmbeddingModelConfiguration: { // BedrockEmbeddingModelConfiguration
//             dimensions: Number("int"),
//             embeddingDataType: "FLOAT32" || "BINARY",
//           },
//         },
//         supplementalDataStorageConfiguration: { // SupplementalDataStorageConfiguration
//           storageLocations: [ // SupplementalDataStorageLocations // required
//             { // SupplementalDataStorageLocation
//               type: "S3", // required
//               s3Location: { // S3Location
//                 uri: "STRING_VALUE", // required
//               },
//             },
//           ],
//         },
//       },
//       kendraKnowledgeBaseConfiguration: { // KendraKnowledgeBaseConfiguration
//         kendraIndexArn: "STRING_VALUE", // required
//       },
//       sqlKnowledgeBaseConfiguration: { // SqlKnowledgeBaseConfiguration
//         type: "REDSHIFT", // required
//         redshiftConfiguration: { // RedshiftConfiguration
//           storageConfigurations: [ // RedshiftQueryEngineStorageConfigurations // required
//             { // RedshiftQueryEngineStorageConfiguration
//               type: "REDSHIFT" || "AWS_DATA_CATALOG", // required
//               awsDataCatalogConfiguration: { // RedshiftQueryEngineAwsDataCatalogStorageConfiguration
//                 tableNames: [ // AwsDataCatalogTableNames // required
//                   "STRING_VALUE",
//                 ],
//               },
//               redshiftConfiguration: { // RedshiftQueryEngineRedshiftStorageConfiguration
//                 databaseName: "STRING_VALUE", // required
//               },
//             },
//           ],
//           queryEngineConfiguration: { // RedshiftQueryEngineConfiguration
//             type: "SERVERLESS" || "PROVISIONED", // required
//             serverlessConfiguration: { // RedshiftServerlessConfiguration
//               workgroupArn: "STRING_VALUE", // required
//               authConfiguration: { // RedshiftServerlessAuthConfiguration
//                 type: "IAM" || "USERNAME_PASSWORD", // required
//                 usernamePasswordSecretArn: "STRING_VALUE",
//               },
//             },
//             provisionedConfiguration: { // RedshiftProvisionedConfiguration
//               clusterIdentifier: "STRING_VALUE", // required
//               authConfiguration: { // RedshiftProvisionedAuthConfiguration
//                 type: "IAM" || "USERNAME_PASSWORD" || "USERNAME", // required
//                 databaseUser: "STRING_VALUE",
//                 usernamePasswordSecretArn: "STRING_VALUE",
//               },
//             },
//           },
//           queryGenerationConfiguration: { // QueryGenerationConfiguration
//             executionTimeoutSeconds: Number("int"),
//             generationContext: { // QueryGenerationContext
//               tables: [ // QueryGenerationTables
//                 { // QueryGenerationTable
//                   name: "STRING_VALUE", // required
//                   description: "STRING_VALUE",
//                   inclusion: "INCLUDE" || "EXCLUDE",
//                   columns: [ // QueryGenerationColumns
//                     { // QueryGenerationColumn
//                       name: "STRING_VALUE",
//                       description: "STRING_VALUE",
//                       inclusion: "INCLUDE" || "EXCLUDE",
//                     },
//                   ],
//                 },
//               ],
//               curatedQueries: [ // CuratedQueries
//                 { // CuratedQuery
//                   naturalLanguage: "STRING_VALUE", // required
//                   sql: "STRING_VALUE", // required
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//     storageConfiguration: { // StorageConfiguration
//       type: "OPENSEARCH_SERVERLESS" || "PINECONE" || "REDIS_ENTERPRISE_CLOUD" || "RDS" || "MONGO_DB_ATLAS", // required
//       opensearchServerlessConfiguration: { // OpenSearchServerlessConfiguration
//         collectionArn: "STRING_VALUE", // required
//         vectorIndexName: "STRING_VALUE", // required
//         fieldMapping: { // OpenSearchServerlessFieldMapping
//           vectorField: "STRING_VALUE", // required
//           textField: "STRING_VALUE", // required
//           metadataField: "STRING_VALUE", // required
//         },
//       },
//       pineconeConfiguration: { // PineconeConfiguration
//         connectionString: "STRING_VALUE", // required
//         credentialsSecretArn: "STRING_VALUE", // required
//         namespace: "STRING_VALUE",
//         fieldMapping: { // PineconeFieldMapping
//           textField: "STRING_VALUE", // required
//           metadataField: "STRING_VALUE", // required
//         },
//       },
//       redisEnterpriseCloudConfiguration: { // RedisEnterpriseCloudConfiguration
//         endpoint: "STRING_VALUE", // required
//         vectorIndexName: "STRING_VALUE", // required
//         credentialsSecretArn: "STRING_VALUE", // required
//         fieldMapping: { // RedisEnterpriseCloudFieldMapping
//           vectorField: "STRING_VALUE", // required
//           textField: "STRING_VALUE", // required
//           metadataField: "STRING_VALUE", // required
//         },
//       },
//       rdsConfiguration: { // RdsConfiguration
//         resourceArn: "STRING_VALUE", // required
//         credentialsSecretArn: "STRING_VALUE", // required
//         databaseName: "STRING_VALUE", // required
//         tableName: "STRING_VALUE", // required
//         fieldMapping: { // RdsFieldMapping
//           primaryKeyField: "STRING_VALUE", // required
//           vectorField: "STRING_VALUE", // required
//           textField: "STRING_VALUE", // required
//           metadataField: "STRING_VALUE", // required
//         },
//       },
//       mongoDbAtlasConfiguration: { // MongoDbAtlasConfiguration
//         endpoint: "STRING_VALUE", // required
//         databaseName: "STRING_VALUE", // required
//         collectionName: "STRING_VALUE", // required
//         vectorIndexName: "STRING_VALUE", // required
//         credentialsSecretArn: "STRING_VALUE", // required
//         fieldMapping: { // MongoDbAtlasFieldMapping
//           vectorField: "STRING_VALUE", // required
//           textField: "STRING_VALUE", // required
//           metadataField: "STRING_VALUE", // required
//         },
//         endpointServiceName: "STRING_VALUE",
//       },
//     },
//     status: "CREATING" || "ACTIVE" || "DELETING" || "UPDATING" || "FAILED" || "DELETE_UNSUCCESSFUL", // required
//     createdAt: new Date("TIMESTAMP"), // required
//     updatedAt: new Date("TIMESTAMP"), // required
//     failureReasons: [ // FailureReasons
//       "STRING_VALUE",
//     ],
//   },
// };
