"use client";

import React from "react";
import type { ExperienceItem } from "@/data/experienceData";

export type ExperienceTheme = {
  type?: "light" | "dark";
  primary: string;     // accent (chips + hover title color)
  primary30: string;   // hover card bg tint
  tertiary: string;    // title default
  tertiary80: string;  // secondary text default
};

type Props = {
  item: ExperienceItem;
  colors: ExperienceTheme;
};

export default function ExperienceCard({ item, colors }: Props) {
  // CSS vars so Tailwind can use arbitrary color values
  const cssVars = {
    ["--accent"]: colors.primary,
    ["--hoverBg"]: colors.primary30,
    ["--title"]: colors.tertiary,
    ["--text"]: colors.tertiary80,
  } as React.CSSProperties;

  return (
    <a
      href={item.href || "#"}
      target={item.href ? "_blank" : undefined}
      rel={item.href ? "noreferrer" : undefined}
      style={cssVars}
      className="group block rounded-md p-3 transition
              bg-transparent hover:bg-[rgba(72,106,127,0.35)]
              border border-transparent hover:border-white/10"
    >
      {/* Two-column grid INSIDE the box: date (left) • content (right) */}
      <div className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] gap-22 items-start">
        {/* Left: date */}
        <div
          className="pt-1 text-[0.72rem] font-medium tracking-wide whitespace-nowrap text-gray-400 font-semibold"
        >
          {item.startYear} — {item.endYear}
        </div>

        {/* Right: content */}
        <div>
          {/* Heading row with arrow */}
          <div className="flex items-start gap-2">
            <h3 className="text-[0.9rem] md:text-[0.98rem] font-semibold leading-tight">
              <span className="text-[color:var(--title)] group-hover:text-[color:var(--accent)] transition-colors duration-200">
                {item.jobtitle}
              </span>
              <span
                className="mx-1 text-[0.92rem] text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors duration-200"
                aria-hidden="true"
              >
                ·
              </span>
              <span className="text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors duration-200">
                {item.company}
              </span>

              {/* Arrow: moves up/right (~45°) + adopts accent color on hover */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="inline-block h-4 w-4 shrink-0 ml-1 translate-y-px
               text-[color:var(--text)] group-hover:text-[color:var(--accent)]
               transition-transform duration-200
               group-hover:-translate-y-1 group-hover:translate-x-1
               motion-reduce:transition-none"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
              </svg>
            </h3>
          </div>

          {/* Summary */}
          {item.summary ? (
            <p className="mt-2 text-[0.78rem] leading-5 md:leading-6 text-[color:var(--text)]">
              {item.summary}
            </p>
          ) : null}

          {/* Skill chips */}
          {item.skills?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.skills.map((s, i) => (
                <span
                  key={`${item.id}-skill-${i}`}
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-medium"
                  style={{
                    backgroundColor: "rgba(12, 214, 204, 0.06)",
                    color: colors.primary,
                    boxShadow: "inset 0 0 0 1px rgba(12, 214, 204, 0.22)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}