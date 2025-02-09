import { PagePadding } from "@/components/wrapper/PagePadding";
import { type AgentSummary } from "@aws-sdk/client-bedrock-agent";
import { getAllBedrockAgents } from "@/server/aws/BedrockAgents";
import Link from "next/link";

const Page = async () => {
  const response = await getAllBedrockAgents();
  const agents = response.agentSummaries ?? [];

  return (
    <PagePadding>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <p className="text-sm text-gray-600">
          Here you can find all available Bedrock agents. Click on any agent to
          view its details and capabilities.
        </p>
        <ul className="space-y-4 py-4">
          {agents.map((agent: AgentSummary) => (
            <li
              key={agent.agentId}
              className="rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <Link
                href={`ai-agent/${agent.agentId}`}
                className="block p-4 hover:bg-gray-50"
              >
                <h2 className="text-lg font-medium text-gray-900 transition-colors hover:text-blue-600">
                  {agent.agentName}
                </h2>
                {agent.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {agent.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    Status:{" "}
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        agent.agentStatus === "PREPARED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {agent.agentStatus}
                    </span>
                  </span>
                  <span>
                    Created:{" "}
                    {agent.updatedAt
                      ? new Date(agent.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
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
