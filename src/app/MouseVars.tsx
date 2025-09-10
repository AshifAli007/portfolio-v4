// components/MouseVars.tsx
"use client";

import { useEffect, useRef } from "react";

export default function MouseVars() {
  const raf = useRef<number | null>(null);
  const x = useRef(0);
  const y = useRef(0);

  useEffect(() => {
    const root = document.documentElement;

    const onMove = (e: PointerEvent) => {
      x.current = e.clientX;
      y.current = e.clientY;

      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          root.style.setProperty("--mouse-x", `${x.current}px`);
          root.style.setProperty("--mouse-y", `${y.current}px`);
          raf.current = null;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return null;
}