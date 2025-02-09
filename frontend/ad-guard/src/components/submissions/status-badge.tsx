import { type ApprovalStatus } from "@/types/submissions";
import { getStatusColor } from "@/utils/submissions";

interface StatusBadgeProps {
  status: ApprovalStatus;
  showProcessing?: boolean;
}

export function StatusBadge({ status, showProcessing }: StatusBadgeProps) {
  return (
    <div className="space-y-1">
      <div
        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
          status,
        )}`}
      >
        {status}
      </div>
      {showProcessing && status === "Processing" && (
        <div className="text-xs text-blue-600">Processing...</div>
      )}
    </div>
  );
}
