import type { Metadata } from "next";
import Link from "next/link";
import ParabolaDemo from "@/components/Math/ParabolaDemo";

export const metadata: Metadata = {
  title: "Quadratic preview",
  description: "Interactive parabola: how coefficients change shape, roots, and vertex.",
};

export default function QuadraticArticlePage() {
  return (
    <article className="mx-auto max-w-2xl px-6 pb-24 pt-2 md:px-8">
      <nav className="mb-10 text-sm">
        <Link
          href="/math"
          className="math-link font-medium text-[color:var(--math-terracotta)] no-underline hover:underline"
        >
          ← Journal
        </Link>
      </nav>

      <header className="mb-10 border-b border-stone-200/90 pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Algebra</p>
        <h1 className="mt-3 font-[family-name:var(--font-math-display)] text-3xl font-semibold tracking-tight text-stone-900 md:text-[2.25rem]">
          Quadratic preview
        </h1>
        <p className="mt-4 text-sm text-stone-500">Interactive</p>
      </header>

      <p className="mb-8 text-[1.05rem] leading-relaxed text-stone-700">
        Drag the coefficients to see how the graph responds, handy for building intuition about roots,
        vertex, and sign of <em>a</em>.
      </p>

      <ParabolaDemo />
    </article>
  );
}
