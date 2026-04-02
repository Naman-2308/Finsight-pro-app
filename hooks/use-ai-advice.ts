import { useCallback, useEffect, useMemo, useState } from "react";
import { getCachedAIAdvice, setCachedAIAdvice } from "@/lib/aiCache";

type AdviceFetcher = () => Promise<{ advice?: string } | undefined | null>;

export function useAiAdvice(fetchAdvice: AdviceFetcher) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      const cached = await getCachedAIAdvice();
      if (cached) {
        setAdvice(cached);
        return;
      }

      const aiData = await fetchAdvice();
      const next = aiData?.advice || "";
      setAdvice(next);

      if (next) {
        await setCachedAIAdvice(next);
      }
    } catch {
      // AI is non-critical; fail silently
      setAdvice("");
    } finally {
      setLoading(false);
    }
  }, [fetchAdvice]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return useMemo(
    () => ({
      advice,
      loading,
      refresh,
      setAdvice,
    }),
    [advice, loading, refresh]
  );
}

