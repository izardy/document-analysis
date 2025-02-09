import { PagePadding } from "@/components/wrapper/PagePadding";
import { getBedrockAgentByID } from "@/server/aws/BedrockAgents";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  try {
    const agent = await getBedrockAgentByID(params.id);

    return (
      <PagePadding>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link
              href="/ai-agent"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Agents
            </Link>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold">{agent.agent?.agentName}</h1>
            {agent.agent?.description && (
              <p className="mt-4 text-gray-600">{agent.agent.description}</p>
            )}
            <div className="mt-6 grid gap-6 border-t border-gray-200 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h2 className="font-medium text-gray-900">Status</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        agent.agent?.agentStatus === "PREPARED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {agent.agent?.agentStatus}
                    </span>
                    {agent.agent?.failureReasons &&
                      agent.agent.failureReasons.length > 0 && (
                        <span className="text-sm text-red-600">
                          {agent.agent.failureReasons.join(", ")}
                        </span>
                      )}
                  </div>
                </div>

                <div>
                  <h2 className="font-medium text-gray-900">
                    Foundation Model
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {agent.agent?.foundationModel || "N/A"}
                  </p>
                </div>

                <div>
                  <h2 className="font-medium text-gray-900">Agent Version</h2>
                  <p className="mt-2 text-gray-600">
                    {agent.agent?.agentVersion || "N/A"}
                  </p>
                </div>

                <div>
                  <h2 className="font-medium text-gray-900">
                    Idle Session Timeout
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {agent.agent?.idleSessionTTLInSeconds
                      ? `${agent.agent.idleSessionTTLInSeconds} seconds`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-medium text-gray-900">Identifiers</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">ID:</span>{" "}
                    <span className="text-gray-600">
                      {agent.agent?.agentId}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">ARN:</span>{" "}
                    <span className="text-gray-600">
                      {agent.agent?.agentArn}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">
                      Resource Role ARN:
                    </span>{" "}
                    <span className="text-gray-600">
                      {agent.agent?.agentResourceRoleArn}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-medium text-gray-900">Timestamps</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Created:</span>{" "}
                    <span className="text-gray-600">
                      {agent.agent?.createdAt
                        ? new Date(agent.agent.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Updated:</span>{" "}
                    <span className="text-gray-600">
                      {agent.agent?.updatedAt
                        ? new Date(agent.agent.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </p>
                  {agent.agent?.preparedAt && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">
                        Prepared:
                      </span>{" "}
                      <span className="text-gray-600">
                        {new Date(agent.agent.preparedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          },
                        )}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {agent.agent?.instruction && (
                <div>
                  <h2 className="font-medium text-gray-900">Instructions</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                    {agent.agent.instruction}
                  </p>
                </div>
              )}

              {(agent.agent?.recommendedActions?.length ?? 0) > 0 && (
                <div>
                  <h2 className="font-medium text-gray-900">
                    Recommended Actions
                  </h2>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {agent.agent?.recommendedActions?.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </PagePadding>
    );
  } catch (error) {
    notFound();
  }
};

export default Page;
