import type { Metadata } from "next";
import Link from "next/link";
import LorenzAttractorCanvas from "@/components/Math/lorenz/LorenzAttractorCanvas";

export const metadata: Metadata = {
  title: "The Lorenz attractor",
  description:
    "The Lorenz system in three dimensions: deterministic equations, chaotic trajectories, and sensitivity to initial conditions.",
};

export default function LorenzArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-2 md:px-8">
      <nav className="mb-10 text-sm">
        <Link
          href="/math"
          className="math-link font-medium text-[color:var(--math-terracotta)] no-underline hover:underline"
        >
          ← Journal
        </Link>
      </nav>

      <header className="mb-10 border-b border-stone-200/90 pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          Dynamical systems
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-math-display)] text-3xl font-semibold tracking-tight text-stone-900 md:text-[2.25rem]">
          The Lorenz attractor
        </h1>
        <p className="mt-4 text-sm text-stone-500">April 12, 2026</p>
      </header>

      <div className="prose-math space-y-6 text-[1.05rem] leading-relaxed text-stone-700">
        <p>
          The{" "}
          <a
            href="https://en.wikipedia.org/wiki/Lorenz_system"
            target="_blank"
            rel="noreferrer noopener"
            className="math-link"
          >
            Lorenz system
          </a>{" "}
          is three coupled ordinary differential equations, introduced by Edward Lorenz as a toy model
          of convection. The same parameters can produce trajectories that never repeat and never
          settle: they trace a thin structure in space (the famous &quot;butterfly&quot;) called a{" "}
          <strong>strange attractor</strong>.
        </p>

        <p>
          The system is <strong>deterministic</strong> (no random terms), yet{" "}
          <strong>chaotic</strong>: two states that start almost on top of each other can diverge
          quickly. Below, two trajectories use the same equations and parameters; the only
          difference is a tiny nudge in the starting value of <em>x</em>. Watch how the orange and
          blue paths peel apart while still living on the same attractor.
        </p>
      </div>

      <figure className="my-10">
        <LorenzAttractorCanvas />
      </figure>

      <div className="space-y-4 rounded-lg border border-stone-200/80 bg-white/60 px-5 py-5 font-mono text-[0.85rem] leading-relaxed text-stone-800 shadow-sm">
        <p className="font-[family-name:var(--font-math-serif)] text-sm font-medium text-stone-600">
          Equations (standard form)
        </p>
        <p className="whitespace-pre-wrap">
          dx/dt = σ (y − x){"\n"}
          dy/dt = x (ρ − z) − y{"\n"}
          dz/dt = xy − β z
        </p>
        <p className="pt-2 font-[family-name:var(--font-math-serif)] text-sm text-stone-600">
          Classic chaotic parameters: σ = 10, ρ = 28, β = 8/3.
        </p>
      </div>

      <p className="mt-10 text-[1.05rem] leading-relaxed text-stone-700">
        For a readable overview, see{" "}
        <a
          href="https://www.wikiwand.com/en/Lorenz_system"
          target="_blank"
          rel="noreferrer noopener"
          className="math-link"
        >
          Wikiwand → Lorenz system
        </a>
        .
      </p>
    </article>
  );
}
