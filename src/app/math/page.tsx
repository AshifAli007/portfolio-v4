import Link from "next/link";
import { mathPosts } from "@/data/mathPosts";

function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MathJournalPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-2 md:px-8">
      <header className="mb-14 border-b border-stone-200/90 pb-10">
        <h1 className="font-[family-name:var(--font-math-display)] text-3xl font-semibold tracking-tight text-stone-900 md:text-[2rem]">
          Journal
        </h1>
        <p className="mt-3 max-w-lg text-[1.05rem] leading-relaxed text-stone-600">
          Short notes and interactive sketches, newest first. Each piece opens on its own page.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {mathPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/math/${post.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--math-terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f4]">
              <time
                dateTime={post.date}
                className="text-sm font-medium tabular-nums text-stone-500"
              >
                {formatPostDate(post.date)}
              </time>
              {post.tag ? (
                <span className="ml-3 text-xs font-medium uppercase tracking-wider text-stone-400">
                  {post.tag}
                </span>
              ) : null}
              <h2 className="mt-3 font-[family-name:var(--font-math-display)] text-2xl font-semibold text-stone-900 transition-colors group-hover:text-[color:var(--math-terracotta)] md:text-[1.75rem]">
                {post.title}
              </h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-stone-600">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--math-terracotta)]">
                Read
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
