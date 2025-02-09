import { useState, useRef, useEffect } from "react";
import type { Submission, ApprovalStatus } from "@/types/submissions";

export function useSubmissionsData() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const activePolls = useRef<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const response = await fetch("/api/marketing");
      const submissions = await response.json();
      setData(submissions);

      // Check for any processing submissions and poll their status
      submissions.forEach((submission: Submission) => {
        if (
          submission.processingStatus === "processing" &&
          !activePolls.current.has(submission.id)
        ) {
          pollStatus(submission.id);
        }
      });
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const pollStatus = async (id: string) => {
    if (activePolls.current.has(id)) return;
    activePolls.current.add(id);

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/marketing?requestId=${id}`);
        const result = await response.json();

        if (result.status !== "processing") {
          setData((prevData) =>
            prevData.map((submission) =>
              submission.id === id
                ? {
                    ...submission,
                    processingStatus: result.status,
                    langchainResults: result.result,
                    syariahStatus: result.result.syariahAnalysis
                      .status as ApprovalStatus,
                    bnmRegulationsStatus: result.result.bnmRegulations.compliant
                      ? "Approved"
                      : "Required Review",
                  }
                : submission,
            ),
          );
          activePolls.current.delete(id);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error polling status for ${id}:`, error);
        activePolls.current.delete(id);
        return true;
      }
    };

    while (!(await checkStatus())) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      activePolls.current.clear();
    };
  }, []);

  return { data, loading, refreshData: fetchData };
}
