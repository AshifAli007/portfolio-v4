"use client";

import { useState } from "react";
import { FiCoffee } from "react-icons/fi";

type ThemeColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  tertiary80?: string;
  primary30?: string;
};

type Props = {
  id?: string;
  colors: ThemeColors;
};

export default function BuyMeCoffee({ id = "coffee", colors }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function startCheckout() {
    setIsLoading(true);
    setMessage(null);
    try {
      // fire-and-forget analytics
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "coffee_click",
          page: typeof window !== "undefined" ? window.location.pathname : "/coffee",
        }),
        keepalive: true,
      });

      const res = await fetch("/api/coffee/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Unable to start checkout.");
      }
      window.location.href = data.url;
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Unable to start checkout.";
      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const accent = colors.primary;

  return (
    <section id={id} className="w-full">
      <div
        className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0f1320]/85 p-4 shadow-lg backdrop-blur"
        style={{
          boxShadow: `0 12px 32px -20px ${
            colors.primary30 ?? "rgba(137,211,206,0.35)"
          }`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl text-xl"
            style={{ backgroundColor: `${accent}1f`, color: accent }}
            aria-hidden
          >
            <FiCoffee />
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Support
            </p>
            <h3 className="text-lg font-semibold text-white">
              Buy me a coffee
            </h3>
          </div>
        </div>

        <p
          className="mt-4 text-sm leading-6 text-slate-300"
          style={{ color: colors.tertiary80 ?? "#d1d5db" }}
        >
          A single $5 coffee fuels my inner spirit. It helps cover
          hosting, adding new features, helping me keep this site fast and thoughtful. Thanks for powering the craft!
        </p>

        {/* <div className="mt-4 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
          <p className="text-xs text-slate-400">Contribution</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-semibold text-white">$5.00</span>
            <span className="text-xs text-slate-400">One-time</span>
          </div>
        </div> */}

        <button
          type="button"
          onClick={startCheckout}
          disabled={isLoading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[0.95rem] font-semibold transition focus:outline-none"
          style={{
            backgroundColor: isLoading ? "rgba(137,211,206,0.55)" : accent,
            color: colors.secondary,
            boxShadow: `0 10px 30px -16px ${
              colors.primary30 ?? "rgba(137,211,206,0.35)"
            }`,
          }}
        >
          {isLoading ? "Opening Stripe…" : "Buy me a coffee"}
        </button>

        {message && (
          <p className="mt-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-center text-xs text-slate-200">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
