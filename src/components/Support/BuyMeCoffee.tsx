"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiCoffee, FiZap } from "react-icons/fi";

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
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("coffee");
    if (status === "success") {
      setMessage("Thanks for the caffeine boost! I'll keep shipping.");
    } else if (status === "cancelled") {
      setMessage("Checkout cancelled — no charge made. Ready when you are.");
    }
  }, []);

  async function startCheckout() {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/coffee/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Unable to start checkout.");
      }
      window.location.href = data.url;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unable to start checkout.";
      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const accent = colors.primary;

  return (
    <section id={id} className="mt-20 px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0f17]/85 p-6 shadow-xl backdrop-blur md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(850px circle at 16% 18%, ${accent}1a, transparent 55%),
              radial-gradient(900px circle at 86% 10%, rgba(255,255,255,0.06), transparent 45%)
            `,
          }}
          aria-hidden
        />

        <div className="relative z-[1] grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em]" style={{ color: accent }}>
              Support
            </p>
            <h2 className="text-2xl font-semibold text-white md:text-[1.7rem]">
              Buy me a coffee
            </h2>
            <p className="text-sm leading-7 text-slate-300 md:text-base" style={{ color: colors.tertiary80 ?? "#d1d5db" }}>
              If you enjoy the builds, a small coffee keeps the late-night experiments running.
              It takes just a few seconds, routed through Stripe for a secure checkout.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: <FiZap />, text: "Secure Stripe checkout" },
                { icon: <FiCoffee />, text: "Covers caffeine + hosting" },
                { icon: <FiCheckCircle />, text: "No account needed" },
                { icon: <FiCheckCircle />, text: "Instant confirmation" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-base"
                    style={{ backgroundColor: `${accent}1f`, color: accent }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[0.88rem] text-slate-200">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative rounded-2xl border border-white/10 bg-[#0f1320]/90 p-5 shadow-lg"
            style={{ boxShadow: `0 18px 55px -28px ${colors.primary30 ?? "rgba(137,211,206,0.35)"}` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Fuel-up</p>
                <p className="text-lg font-semibold text-white">Single coffee</p>
              </div>
              <div
                className="grid h-11 w-11 place-items-center rounded-xl text-2xl"
                style={{ backgroundColor: `${accent}26`, color: accent }}
                aria-hidden
              >
                <FiCoffee />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-400">Choose cups</p>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3].map((val) => {
                  const active = quantity === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuantity(val)}
                      className={[
                        "rounded-full px-3 py-1 text-sm font-semibold transition",
                        active ? "ring-2 ring-offset-2 ring-offset-[#0f1320]" : "hover:-translate-y-[1px]",
                      ].join(" ")}
                      style={{
                        backgroundColor: active ? accent : "rgba(255,255,255,0.06)",
                        color: active ? colors.secondary : colors.tertiary,
                      }}
                    >
                      {val} {val === 1 ? "cup" : "cups"}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={startCheckout}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[0.95rem] font-semibold transition focus:outline-none"
              style={{
                backgroundColor: isLoading ? "rgba(137,211,206,0.55)" : accent,
                color: colors.secondary,
                boxShadow: `0 10px 30px -16px ${colors.primary30 ?? "rgba(137,211,206,0.35)"}`,
              }}
            >
              {isLoading ? "Redirecting to Stripe…" : "Checkout with Stripe"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Secured by Stripe. You will be redirected to complete payment.
            </p>
            {message && (
              <p className="mt-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-center text-sm text-slate-200">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
