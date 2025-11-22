import { useEffect, useState } from "react";

export function useSpotifyData<T>(endpoint: string, options?: { refreshInterval?: number }) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch Spotify data");
        const json = (await res.json()) as T;
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err as Error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();

    if (options?.refreshInterval) {
      timer = setInterval(fetchData, options.refreshInterval);
    }

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [endpoint, options?.refreshInterval]);

  return { data, error, isLoading };
}
