/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import type { Recommendation } from "./types";

const PROFILE_URL = "https://www.linkedin.com/in/mohammad-ashif-cv/";

const truncate = (str: string, max = 200) => {
  if (!str) return "";
  if (str.length <= max) return str;
  return `${str.slice(0, max).trimEnd()}…`;
};

type RecommendationCardProps = {
  recommendation: Recommendation;
};

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const { authorName, authorTitle, avatarUrl, text, date } = recommendation;
  const truncatedText = truncate(text);
  const isTruncated = truncatedText.length < text.length;

  return (
    <article
      aria-label={`Recommendation from ${authorName}`}
      className="flex w-full min-w-[280px] max-w-xl flex-shrink-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur transition-colors hover:bg-white/[0.06]"
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${authorName} avatar`}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
            loading="lazy"
          />
        ) : null}
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-[#89d3ce]">{authorName}</span>
          {authorTitle ? (
            <span className="text-sm text-white/60">{authorTitle}</span>
          ) : null}
          {date ? <span className="text-xs text-white/40">{date}</span> : null}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-300">
        {truncatedText}
        {isTruncated ? (
          <>
            {" "}
            <Link
              href={PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[#89d3ce] underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89d3ce]"
            >
              Read more →
            </Link>
          </>
        ) : null}
      </p>
    </article>
  );
};

export { truncate };
export default RecommendationCard;
