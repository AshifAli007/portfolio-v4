"use client";

import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";


type MonkeytypeSummary = {
  wpm: number;
  accuracy: number;
  totalWords: number;
  testsCompleted: number;
  currentStreak: number;
  keyboard: string;
  mode: string;
  language: string;
  timestamp: string;
};

const accent = "#ffbe0b";

const formatAgo = (iso: string) => {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function MonkeytypeSummary() {
  const [data, setData] = useState<MonkeytypeSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/monkeytype/summary", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load Monkeytype data");
        const json = (await res.json()) as MonkeytypeSummary;
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError((err as Error).message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fallback = {
    wpm: 0,
    accuracy: 0,
    totalWords: 0,
    testsCompleted: 0,
    currentStreak: 0,
    keyboard: "—",
    mode: "—",
    language: "—",
    timestamp: "",
  };
  const view = data ?? fallback;

  return (
    <section className="mt-12 mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="w-full rounded-2xl border border-white/10 bg-[#0c0f17]/90 p-4 shadow-lg backdrop-blur md:w-11/12 lg:w-10/12">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
              Monkeytype
            </p>
            <h3 className="text-lg font-semibold text-white">Typing snapshot</h3>
            <p className="text-xs text-slate-400">
              {view.timestamp ? `Last test • ${formatAgo(view.timestamp)}` : "Latest test stats"}
            </p>
          </div>
          <a
            href="https://monkeytype.com/profile/AshifAli"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Monkeytype profile"
            className="relative bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors"
            style={{ color: accent }}
          >
            <FaExternalLinkAlt />
          </a>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="WPM" value={view.wpm} highlight />
          <Stat label="Accuracy" value={`${view.accuracy.toFixed(0)}%`} />
          <Stat label="Words" value={view.totalWords} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <Stat label="Tests" value={view.testsCompleted} />
          <Stat label="Streak" value={view.currentStreak} />
          <Stat label="Keyboard" value={'Mac M2 pro'} />
        </div>

        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
      <p className="text-[0.5rem] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-white" style={highlight ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}
