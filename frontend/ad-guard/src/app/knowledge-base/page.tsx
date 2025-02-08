import { PagePadding } from "@/components/wrapper/PagePadding";
import {
  getAllKnowledgeBases,
  getKnowledgeBaseDocumentsByID,
} from "@/server/aws/Knowledgebased";

const page = async () => {
  //   console.log(getAllKnowledgeBases());
  const { knowledgeBaseSummaries } = await getAllKnowledgeBases();
  console.log(knowledgeBaseSummaries);

  if (knowledgeBaseSummaries && knowledgeBaseSummaries.length > 0) {
    const { documentDetails } = await getKnowledgeBaseDocumentsByID(
      knowledgeBaseSummaries[0]?.knowledgeBaseId as string,
      "MC2U0NRO3Z",
    );
    console.log("ta?");
    console.dir(documentDetails);
    console.log("documentDetails:", JSON.stringify(documentDetails, null, 2));
  }

  return (
    <PagePadding>
      Knowledge Base
      <ul>
        {knowledgeBaseSummaries?.map((knowledgeBase) => (
          <li key={knowledgeBase.knowledgeBaseId}>{knowledgeBase.name}</li>
        ))}
      </ul>
    </PagePadding>
  );
};

export default page;
