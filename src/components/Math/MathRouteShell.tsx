"use client";

import { useEffect } from "react";

/**
 * Toggles global styles (cursor, background) for the math journal theme.
 */
export default function MathRouteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("math-route");
    return () => document.documentElement.classList.remove("math-route");
  }, []);

  return <>{children}</>;
}
