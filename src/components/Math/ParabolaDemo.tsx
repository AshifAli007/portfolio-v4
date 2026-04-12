"use client";

import { useMemo, useState } from "react";

const W = 400;
const H = 260;
const PAD = 24;
const X_MIN = -4;
const X_MAX = 4;

function sampleParabola(a: number, b: number, c: number, steps: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = X_MIN + (X_MAX - X_MIN) * t;
    const y = a * x * x + b * x + c;
    pts.push({ x, y });
  }
  return pts;
}

function toSvgX(x: number) {
  const nx = (x - X_MIN) / (X_MAX - X_MIN);
  return PAD + nx * (W - 2 * PAD);
}

function toSvgY(y: number, yMin: number, yMax: number) {
  const ny = (y - yMin) / (yMax - yMin);
  return H - PAD - ny * (H - 2 * PAD);
}

export default function ParabolaDemo() {
  const [a, setA] = useState(0.35);
  const [b, setB] = useState(0.2);
  const [c, setC] = useState(-0.5);

  const { pathD, yMin, yMax } = useMemo(() => {
    const pts = sampleParabola(a, b, c, 80);
    let ymin = Math.min(...pts.map((p) => p.y), -2);
    let ymax = Math.max(...pts.map((p) => p.y), 2);
    const padY = (ymax - ymin) * 0.08 || 0.5;
    ymin -= padY;
    ymax += padY;

    const d = pts
      .map((p, i) => {
        const sx = toSvgX(p.x);
        const sy = toSvgY(p.y, ymin, ymax);
        return `${i === 0 ? "M" : "L"} ${sx.toFixed(2)} ${sy.toFixed(2)}`;
      })
      .join(" ");

    return { pathD: d, yMin: ymin, yMax: ymax };
  }, [a, b, c]);

  const axisY = toSvgY(0, yMin, yMax);
  const axisX = toSvgX(0);

  return (
    <div className="rounded-lg border border-stone-200/90 bg-white/75 p-6 shadow-sm backdrop-blur-[2px]">
      <p className="mb-4 text-sm text-stone-600">
        Interactive preview:{" "}
        <span className="font-mono text-[0.95rem] text-[color:var(--math-terracotta,#b45309)]">
          y = {a.toFixed(2)}x² + {b.toFixed(2)}x + {c.toFixed(2)}
        </span>
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-md text-[color:var(--math-terracotta,#b45309)]"
        role="img"
        aria-label="Graph of a quadratic function"
      >
        <line
          x1={PAD}
          y1={axisY}
          x2={W - PAD}
          y2={axisY}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <line
          x1={axisX}
          y1={PAD}
          x2={axisX}
          y2={H - PAD}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <div className="mt-5 space-y-3">
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          <span className="uppercase tracking-wide">a</span>
          <input
            type="range"
            min={-1.5}
            max={1.5}
            step={0.01}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full accent-[color:var(--math-terracotta,#b45309)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          <span className="uppercase tracking-wide">b</span>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.01}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-[color:var(--math-terracotta,#b45309)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-stone-500">
          <span className="uppercase tracking-wide">c</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.01}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="w-full accent-[color:var(--math-terracotta,#b45309)]"
          />
        </label>
      </div>
    </div>
  );
}
