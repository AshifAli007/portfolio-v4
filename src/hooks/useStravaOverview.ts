"use client";

import { useCallback, useEffect, useState } from "react";

import type { StravaOverview } from "@/lib/strava/types";

type UseStravaOverviewOptions = {
  autoLoad?: boolean;
};

type StravaOverviewState = {
  data: StravaOverview | null;
  loading: boolean;
  error: string | null;
};

const promiseCache = new Map<string, Promise<StravaOverview>>();
const CACHE_KEY = "strava:overview";

const fetchOverview = (force?: boolean): Promise<StravaOverview> => {
  if (!force) {
    const cached = promiseCache.get(CACHE_KEY);
    if (cached) return cached;
  } else {
    promiseCache.delete(CACHE_KEY);
  }

  const url = new URL("/api/strava/overview", window.location.origin);
  if (force) url.searchParams.set("force", "true");

  const request = fetch(url.toString()).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load Strava overview (${response.status})`);
    }
    return response.json() as Promise<StravaOverview>;
  });

  promiseCache.set(CACHE_KEY, request);
  return request;
};

export const useStravaOverview = ({ autoLoad = true }: UseStravaOverviewOptions = {}) => {
  const [state, setState] = useState<StravaOverviewState>({
    data: null,
    loading: autoLoad,
    error: null,
  });

  useEffect(() => {
    if (!autoLoad) return;

    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchOverview()
      .then((data) => {
        if (!active) return;
        setState({
          data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unexpected error when loading Strava data.",
        });
      });

    return () => {
      active = false;
    };
  }, [autoLoad]);

  const refetch = useCallback((opts?: { force?: boolean }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    return fetchOverview(opts?.force)
      .then((data) => {
        setState({
          data,
          loading: false,
          error: null,
        });
        return data;
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unexpected error when loading Strava data.";
        setState({
          data: null,
          loading: false,
          error: message,
        });
        throw error;
      });
  }, []);

  return {
    ...state,
    refetch,
  };
};
