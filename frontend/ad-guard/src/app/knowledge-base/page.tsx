import { PagePadding } from "@/components/wrapper/PagePadding";
import { getAllKnowledgeBases } from "@/server/aws/Knowledgebased";
import Link from "next/link";

const Page = async () => {
  const { knowledgeBaseSummaries } = await getAllKnowledgeBases();

  return (
    <PagePadding>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-sm text-gray-600">
          Here you can find all available knowledge bases in the system. Click
          on any knowledge base to view its details and manage its content.
        </p>
        <ul className="space-y-4 py-4">
          {knowledgeBaseSummaries?.map((knowledgeBase) => (
            <li
              key={knowledgeBase.knowledgeBaseId}
              className="rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <Link
                href={`knowledge-base/${knowledgeBase.knowledgeBaseId}`}
                className="block p-4 hover:bg-gray-50"
              >
                <h2 className="text-lg font-medium text-gray-900 transition-colors hover:text-blue-600">
                  {knowledgeBase.name}
                </h2>
                {knowledgeBase.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {knowledgeBase.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    Status:{" "}
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        knowledgeBase.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {knowledgeBase.status}
                    </span>
                  </span>
                  <span>
                    Updated:{" "}
                    {knowledgeBase.updatedAt
                      ? new Date(knowledgeBase.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PagePadding>
  );
};

export default Page;
