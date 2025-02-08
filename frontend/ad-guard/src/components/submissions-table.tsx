"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  Table as TableType,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "./date-picker-with-range";

type ApprovalStatus = "Approved" | "Rejected" | "Required Review";

interface Submission {
  id: string;
  campaign_name: string;
  platform: string;
  classification: string;
  submittedDate: string;
  syariahStatus: ApprovalStatus;
  bnmRegulationsStatus: ApprovalStatus;
}

const data: Submission[] = [
  {
    id: "1",
    campaign_name: "Youth Savings Campaign 2024",
    platform: "instagram",
    classification: "New Product/Service",
    submittedDate: "2024-02-08",
    syariahStatus: "Required Review",
    bnmRegulationsStatus: "Required Review",
  },
  {
    id: "2",
    campaign_name: "Ramadan Digital Banking Promo",
    platform: "facebook",
    classification: "Campaign",
    submittedDate: "2024-02-07",
    syariahStatus: "Approved",
    bnmRegulationsStatus: "Approved",
  },
  {
    id: "3",
    campaign_name: "Credit Card Benefits Update",
    platform: "edm",
    classification: "Existing Product/Service",
    submittedDate: "2024-02-06",
    syariahStatus: "Rejected",
    bnmRegulationsStatus: "Required Review",
  },
];

export function SubmissionsTable() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const getPlatformDisplay = (platform: string) => {
    const platformMap: Record<string, string> = {
      edm: "Electronic Direct Mail Marketing (eDM)",
      instagram: "Instagram",
      twitter: "Twitter/X",
      facebook: "Facebook",
      tiktok: "TikTok",
      youtube: "YouTube",
    };
    return platformMap[platform] || platform;
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Required Review":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "campaign_name",
      header: "Campaign Name",
      cell: ({ row }: { row: Row<Submission> }) => (
        <div className="font-medium">{row.getValue("campaign_name")}</div>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }: { row: Row<Submission> }) => (
        <div>{getPlatformDisplay(row.getValue("platform"))}</div>
      ),
    },
    {
      accessorKey: "classification",
      header: "Classification",
      cell: ({ row }: { row: Row<Submission> }) => (
        <div>{row.getValue("classification")}</div>
      ),
    },
    {
      accessorKey: "submittedDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Submission> }) => (
        <div>{row.getValue("submittedDate")}</div>
      ),
      filterFn: (row, _columnId, filterValue: string[]) => {
        const cellDate = new Date(row.getValue("submittedDate") as string);
        const [start, end] = filterValue || [];

        if (!filterValue || !start) return true;

        const startDate = new Date(start);
        if (!end) return cellDate >= startDate;

        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end day
        return cellDate >= startDate && cellDate <= endDate;
      },
    },
    {
      accessorKey: "syariahStatus",
      header: "Syariah Status",
      cell: ({ row }: { row: Row<Submission> }) => {
        const status = row.getValue("syariahStatus") as ApprovalStatus;
        return (
          <div
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
              status,
            )}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "bnmRegulationsStatus",
      header: "BNM Regulations Status",
      cell: ({ row }: { row: Row<Submission> }) => {
        const status = row.getValue("bnmRegulationsStatus") as ApprovalStatus;
        return (
          <div
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
              status,
            )}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Submission> }) => {
        return (
          <Button
            variant="outline"
            onClick={() => router.push(`/marketing/results/${row.original.id}`)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 py-4">
        <Input
          placeholder="Filter campaigns..."
          value={
            (table.getColumn("campaign_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("campaign_name")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />

        <Select
          value={
            (table.getColumn("platform")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("platform")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="edm">eDM</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("syariahStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("syariahStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Syariah status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Required Review">Required Review</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table
              .getColumn("bnmRegulationsStatus")
              ?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("bnmRegulationsStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by BNM status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Required Review">Required Review</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange
          date={dateRange}
          onDateChange={(newDateRange) => {
            setDateRange(newDateRange);
            if (newDateRange?.from) {
              const from = format(newDateRange.from, "yyyy-MM-dd");
              const to = newDateRange.to
                ? format(newDateRange.to, "yyyy-MM-dd")
                : "";
              table.getColumn("submittedDate")?.setFilterValue([from, to]);
            } else {
              table.getColumn("submittedDate")?.setFilterValue([]);
            }
          }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
