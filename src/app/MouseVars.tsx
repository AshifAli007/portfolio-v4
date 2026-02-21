"use client";

import { useEffect, useRef } from "react";

export default function MouseVars() {
  const raf = useRef<number | null>(null);
  const x = useRef(0);
  const y = useRef(0);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const glow = glowRef.current;
    const galaxy = document.getElementById("galaxy-container");

    const onMove = (e: PointerEvent) => {
      if (galaxy && e.target instanceof Node && galaxy.contains(e.target)) return;

      x.current = e.clientX;
      y.current = e.clientY;

      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          root.style.setProperty("--mouse-x", `${x.current}px`);
          root.style.setProperty("--mouse-y", `${y.current}px`);
          if (glow) {
            glow.style.transform = `translate(${x.current}px, ${y.current}px)`;
          }
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

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed z-0"
      style={{
        top: 0,
        left: 0,
        width: "var(--glow-size)",
        height: "var(--glow-size)",
        marginLeft: "calc(var(--glow-size) / -2)",
        marginTop: "calc(var(--glow-size) / -2)",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(var(--glow-color), var(--glow-opacity)), transparent 65%)",
        willChange: "transform",
        transform: "translate(50vw, 50vh)",
      }}
    />
  );
}
