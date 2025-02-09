import type { ApprovalStatus } from "@/types/submissions";

export const getPlatformDisplay = (platform: string) => {
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

export const getStatusColor = (status: ApprovalStatus) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Required Review":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
