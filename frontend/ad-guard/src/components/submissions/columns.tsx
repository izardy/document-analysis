import { type ColumnDef } from "@tanstack/react-table";
import { type Submission } from "@/types/submissions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { getPlatformDisplay } from "@/utils/submissions";
import { StatusBadge } from "./status-badge";

export const getSubmissionColumns = (
  onViewDetails: (id: string) => void,
): ColumnDef<Submission>[] => [
  {
    accessorKey: "campaign_name",
    header: "Campaign Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("campaign_name")}</div>
    ),
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div>{getPlatformDisplay(row.getValue("platform"))}</div>
    ),
  },
  {
    accessorKey: "classification",
    header: "Classification",
    cell: ({ row }) => <div>{row.getValue("classification")}</div>,
  },
  {
    accessorKey: "submittedDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submitted Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("submittedDate")}</div>,
    filterFn: (row, _columnId, filterValue: string[]) => {
      const cellDate = new Date(row.getValue("submittedDate") as string);
      const [start, end] = filterValue || [];

      if (!filterValue || !start) return true;

      const startDate = new Date(start);
      if (!end) return cellDate >= startDate;

      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      return cellDate >= startDate && cellDate <= endDate;
    },
  },
  {
    accessorKey: "syariahStatus",
    header: "Syariah Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue("syariahStatus")}
        showProcessing={row.original.processingStatus === "processing"}
      />
    ),
  },
  {
    accessorKey: "bnmRegulationsStatus",
    header: "BNM Regulations Status",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("bnmRegulationsStatus")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <Button
          variant="outline"
          onClick={() => onViewDetails(submission.id)}
          className={
            submission.processingStatus === "processing" ? "animate-pulse" : ""
          }
        >
          {submission.processingStatus === "processing"
            ? "Processing..."
            : "View Details"}
        </Button>
      );
    },
  },
];
