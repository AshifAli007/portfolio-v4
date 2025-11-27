"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

async function track(event: string, body: Record<string, unknown> = {}) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...body }),
      keepalive: true,
    });
  } catch {
    // swallow errors to avoid impacting UX
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = searchParams ? `${pathname}?${searchParams.toString()}` : pathname;
    if (fullPath === lastPath.current) return;
    lastPath.current = fullPath;
    void track("page_view", { page: pathname });
  }, [pathname, searchParams]);

  return null;
}
