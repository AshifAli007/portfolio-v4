import type { Metadata } from "next";
import Link from "next/link";
import { affirmationThemes } from "@/data/affirmations";

export const metadata: Metadata = {
  title: "Morning Affirmations",
  description:
    "Morning affirmations by theme: motivation, stress, abundance, focus, and gratitude.",
};

export default function AffirmationsArticlePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-2 md:px-8">
      <nav className="mb-10 text-sm">
        <Link
          href="/blog"
          className="math-link font-medium text-[color:var(--math-terracotta)] no-underline hover:underline"
        >
          ← Journal
        </Link>
      </nav>

      <header className="mb-10 border-b border-stone-200/90 pb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Mindset</p>
        <h1 className="mt-3 font-[family-name:var(--font-math-display)] text-3xl font-semibold tracking-tight text-stone-900 md:text-[2.25rem]">
          Morning Affirmations by Theme
        </h1>
        <p className="mt-4 text-sm text-stone-500">November 1, 2026</p>
      </header>

      <p className="text-[1.05rem] leading-relaxed text-stone-700">
        Pick one or two from a list when you need them. If one feels too far from reality, try
        rewording it as &quot;I am becoming...&quot; so it doesn&apos;t backfire.
      </p>

      <nav aria-label="Themes" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {affirmationThemes.map((theme) => (
          <a key={theme.id} href={`#${theme.id}`} className="math-link font-medium">
            {theme.title.replace("Morning Affirmations for ", "")}
          </a>
        ))}
      </nav>

      <div className="mt-12 flex flex-col gap-12">
        {affirmationThemes.map((theme) => (
          <section key={theme.id} id={theme.id} className="scroll-mt-8">
            <h2 className="font-[family-name:var(--font-math-display)] text-2xl font-semibold text-stone-900 md:text-[1.75rem]">
              {theme.title}
            </h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-stone-600">{theme.intro}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-6 text-[1.05rem] leading-relaxed text-stone-800 marker:text-stone-400">
              {theme.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  );
}
