import { PagePadding } from "@/components/wrapper/PagePadding";
import { getKnowledgeBaseDocumentsByID } from "@/server/aws/Knowledgebased";
import React, { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

const DocumentCard = ({ document }: { document: any }) => (
  <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Document Details
        </h3>
        <p className="text-sm text-muted-foreground">
          Comprehensive information about this knowledge base document
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="font-medium text-muted-foreground">Data Source ID</h4>
          <p className="mt-1 font-mono">{document.dataSourceId}</p>
        </div>

        <div>
          <h4 className="font-medium text-muted-foreground">
            Knowledge Base ID
          </h4>
          <p className="mt-1 font-mono">{document.knowledgeBaseId}</p>
        </div>

        <div>
          <h4 className="font-medium text-muted-foreground">Status</h4>
          <span
            className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              document.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : document.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {document.status}
          </span>
        </div>

        <div>
          <h4 className="font-medium text-muted-foreground">Last Updated</h4>
          <p className="mt-1">
            {new Date(document.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {document.identifier && (
        <>
          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-muted-foreground">
              Source Details
            </h4>

            {document.identifier.s3?.uri && (
              <div className="rounded-md bg-muted p-3">
                <p className="break-all font-mono text-sm">
                  {document.identifier.s3.uri}
                </p>
              </div>
            )}

            {document.identifier.dataSourceType && (
              <p className="text-sm">
                <span className="font-medium">Source Type: </span>
                {document.identifier.dataSourceType}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="space-y-4">
    <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>
    <div className="h-[200px] animate-pulse rounded-lg bg-muted"></div>
  </div>
);

// Add props to get the params
const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const { documentDetails } = await getKnowledgeBaseDocumentsByID(
    id,
    "MC2U0NRO3Z",
  );

  return (
    <PagePadding>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Knowledge Base Document
          </h2>
          <p className="text-muted-foreground">
            View detailed information about this document
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <div className="grid gap-6">
            {documentDetails?.map((document, i) => (
              <DocumentCard key={i} document={document} />
            ))}
          </div>
        </Suspense>
      </div>
    </PagePadding>
  );
};

export default Page;
