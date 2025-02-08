"use client";

import { SubmissionsTable } from "@/components/submissions-table";
import { PagePadding } from "@/components/wrapper/PagePadding";

export default function ResultsPage() {
  return (
    <PagePadding>
      <h1 className="mb-6 text-2xl font-bold">Ad Review Submissions</h1>
      <SubmissionsTable />
    </PagePadding>
  );
}
