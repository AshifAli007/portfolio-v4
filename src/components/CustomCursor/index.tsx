"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  // Avoid showing on touch-only devices
  const shouldUse = typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // target (mouse) position
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // ring position that eases to target
  const ringX = useRef(0);
  const ringY = useRef(0);

  const rafId = useRef<number | null>(null);
  const visible = useRef(false);

// ...existing code...
useEffect(() => {
  if (!shouldUse) return;

  const dot = dotRef.current!;
  const ring = ringRef.current!;
  const ease = 0.18; // trailing speed: smaller = more delay

  // Treat these as interactive areas where we show the native pointer
  const isInteractive = (t: EventTarget | null) =>
    t instanceof Element &&
    !!t.closest(
      'a[href], button, [role="button"], input, textarea, select, [contenteditable="true"], .allow-system-cursor'
    );

  const setDotTransform = (x: number, y: number) => {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };
  const setRingTransform = (x: number, y: number) => {
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const onMove = (e: PointerEvent) => {
    visible.current = true;
    mouseX.current = e.clientX;
    mouseY.current = e.clientY;

    // dot snaps immediately
    setDotTransform(mouseX.current, mouseY.current);

    // Hide custom cursor over interactives so native pointer is visible
    const overInteractive = isInteractive(e.target);
    const opacity = overInteractive ? "0" : "1";
    if (dot.style.opacity !== opacity) {
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    }
  };

  const onLeave = () => {
    visible.current = false;
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  };

  const onDown = () => {
    ring.style.scale = "0.9";
  };
  const onUp = () => {
    ring.style.scale = "1";
  };

  const animate = () => {
    const dx = mouseX.current - ringX.current;
    const dy = mouseY.current - ringY.current;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      ringX.current += dx * ease;
      ringY.current += dy * ease;
      setRingTransform(ringX.current, ringY.current);
    }
    rafId.current = requestAnimationFrame(animate);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

  // init hidden and start animation
  dot.style.opacity = "0";
  ring.style.opacity = "0";
  animate();

  return () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
  };
}, [shouldUse]);
// ...existing code...

  if (!shouldUse) return null;

  return (
    <>
      {/* inner bold dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="
          fixed left-0 top-0 z-[9999] pointer-events-none
          h-[0.3rem] w-[0.3rem] rounded-full
          bg-[var(--foreground)]
          transition-opacity duration-150
          will-change-transform
        "
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* trailing ring */}
      <div
        ref={ringRef}
        aria-hidden
        className="
          fixed left-0 top-0 z-[9999] pointer-events-none
          h-[1.7rem] w-[1.7rem] rounded-full
          border border-white/20
          transition-[opacity,scale] duration-150
          will-change-transform
        "
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}