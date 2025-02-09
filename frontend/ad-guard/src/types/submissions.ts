export type ApprovalStatus =
  | "Approved"
  | "Rejected"
  | "Required Review"
  | "Processing";

export interface Submission {
  id: string;
  campaign_name: string;
  platform: string;
  classification: string;
  submittedDate: string;
  syariahStatus: ApprovalStatus;
  bnmRegulationsStatus: ApprovalStatus;
  processingStatus?: "processing" | "completed" | "error";
  langchainResults?: {
    syariahAnalysis: {
      status: string;
      explanation: string;
    };
    bnmRegulations: {
      compliant: boolean;
      regulations: string[];
      explanation: string;
    };
    recommendations: {
      items: string[];
      rationale: string;
    };
    additionalInsights: {
      marketTrends: string[];
      riskFactors: string[];
      competitiveAnalysis: string;
    };
  };
}
