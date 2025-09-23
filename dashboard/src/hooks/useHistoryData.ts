import { API_URL } from "@/config";
import type { HistoryResponse } from "@/types";
import { useEffect, useState } from "react";

export const useHistoryData = (start: Date, end: Date) => {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          // The dates are converted to UTC before being sent to the backend.
          `${API_URL}/history/metrics?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [start, end]);

  return { data, loading, error };
};
