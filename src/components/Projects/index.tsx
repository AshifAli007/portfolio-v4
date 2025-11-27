// src/components/Projects/index.tsx
"use client";

import React from "react";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import { projectsData, type Project } from "@/data/projectsData";

/* -------------------------------- types -------------------------------- */

type SectionTheme = {
  primary: string;
  secondary: string;
  tertiary: string;
  tertiary80: string;
  primary30: string;
};

type CardTheme = {
  primary: string;
  secondary: string;
  tertiary: string;
  tertiary80: string;
  primary30: string;
};

type ProjectsProps = {
  id?: string;
  data?: Project[];
  colors: SectionTheme;
  title?: string;
};

/* ------------------------------ main export ----------------------------- */

export default function Projects({
  id = "projects",
  data = projectsData,
  colors,
  title = "Projects",
}: ProjectsProps) {
  const logProjectClick = (projectName: string, url?: string) => {
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "project_click",
        target: projectName,
        meta: url ? { url } : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  };

  // Mark which cards should be wide (horizontal layout) vs tall (vertical layout with extra height)
  const featuredWide = new Set<number>([1, 4, 8]); // wide (xl:col-span-2)
  const featuredTall = new Set<number>([2]); // tall (row-span-2)

  return (
    <section
      id={id}
      className="px-4 py-8 md:px-8"
      style={{ ["--section-bg" as string]: colors.secondary }}
    >
      {/* Right-side 60% wrapper on lg+; 100% on mobile */}
      <div className="w-full lg:w-[60%] ml-auto">
        <header className="mb-6">
          <h1
            className="text-[1.35rem] md:text-[1.6rem] font-semibold tracking-tight"
            style={{ color: colors.primary }}
          >
            {title}
          </h1>
        </header>

        <div
          className="
            grid grid-flow-dense
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
            gap-4 md:gap-5
            auto-rows-[minmax(220px,auto)]
          "
        >
          {data.map((project) => {
            const isWide = featuredWide.has(project.id);
            const isTall = featuredTall.has(project.id);

            const spanWide = isWide ? "xl:col-span-2" : "";
            const spanTall = isTall ? "row-span-2" : "";

            // horizontal for wide (unless also tall), otherwise vertical
            const layout: "horizontal" | "vertical" =
              isWide && !isTall ? "horizontal" : "vertical";

            return (
              <div key={project.id} className={[spanWide, spanTall].filter(Boolean).join(" ")}>
                <ProjectCard
                  project={project}
                  layout={layout}
                  onClick={(url) => logProjectClick(project.projectName, url)}
                  colors={{
                    primary: colors.primary,
                    secondary: colors.secondary,
                    tertiary: colors.tertiary,
                    primary30: colors.primary30,
                    tertiary80: colors.tertiary80,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- inlined card ui ---------------------------- */

function ProjectCard({
  project,
  colors,
  layout = "vertical",
  onClick,
}: {
  project: Project;
  colors: CardTheme;
  layout?: "horizontal" | "vertical";
  onClick?: (url?: string) => void;
}) {
  const { projectName, projectDesc, tags, code, demo, image } = project;
  const titleHref = demo || code || "#";
  const titleIsLink = Boolean(demo || code);

  return (
    <article
      className={[
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl",
        "ring-1 ring-white/5",
        "transition-transform duration-300 hover:-translate-y-[1px]",
        "shadow-[0_4px_22px_-10px_rgba(0,0,0,0.45)]",
        "p-4 md:p-4.5",
      ].join(" ")}
      style={
        {
          boxShadow: `0 8px 28px -14px ${colors.primary30}`,
          ["--title"]: "#ffffff",
          ["--title-hover"]: colors.primary,
        } as React.CSSProperties
      }
    >
      {/* soft wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px circle at 20% -10%, rgba(20,184,166,0.055), transparent 60%), radial-gradient(800px circle at 120% 120%, rgba(59,130,246,0.035), transparent 60%)",
        }}
      />

      {/* CONTENT */}
      {layout === "horizontal" ? (
        // Wide card: image left (40%), content right (60%)
        <div className="relative z-[1] flex min-h-[220px] gap-4">
          <div className="basis-[40%] shrink-0 overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={projectName} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Heading */}
            <h3 className="text-[0.9rem] md:text-[0.98rem] font-semibold leading-6 tracking-tight text-[color:var(--title)] group-hover:text-[color:var(--title-hover)] transition-colors duration-200">
              {titleIsLink ? (
                <Link
                  href={titleHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 allow-system-cursor"
                  onClick={() => onClick?.(titleHref)}
                >
                  <span className="truncate">{projectName}</span>
                  {/* Arrow SVG next to heading */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="inline-block h-4 w-4 shrink-0 ml-1 translate-y-px text-[color:var(--title)] group-hover:text-[color:var(--title-hover)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="truncate">{projectName}</span>
              )}
            </h3>

            {/* Description */}
            <p className="mt-2 text-[0.78rem] leading-6 text-slate-300/90" style={{ color: colors.tertiary80 }}>
              {projectDesc}
            </p>

            {/* Footer pinned to bottom */}
            <div className="mt-auto pt-4 flex items-end justify-between">
              {/* Left bottom: GitHub icon */}
              <div>
                {code && (
                  <Link
                    href={code}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="allow-system-cursor inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-colors"
                    aria-label="View code on GitHub"
                    title="GitHub"
                    style={{ color: colors.tertiary }}
                    onClick={() => onClick?.(code)}
                  >
                    <FiGithub className="text-[1.05rem]" />
                  </Link>
                )}
              </div>

              {/* Right bottom: skills/tags */}
              {!!tags?.length && (
                <ul className="flex flex-wrap justify-end gap-1.5">
                  {tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full px-2 py-[3px] text-[10px] ring-1"
                      style={{
                        color: "rgb(182 233 228)",
                        background: "rgba(20,184,166,0.12)",
                        borderColor: "rgba(45,212,191,0.2)",
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Tall/regular card: title → full-width image → description
        <div className="relative z-[1] flex min-h-[220px] flex-col">
          {/* Heading */}
          <h3 className="text-[0.9rem] md:text-[0.98rem] font-semibold leading-6 tracking-tight text-[color:var(--title)] group-hover:text-[color:var(--title-hover)] transition-colors duration-200">
            {titleIsLink ? (
              <Link
                href={titleHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5"
                onClick={() => onClick?.(titleHref)}
              >
                <span className="truncate">{projectName}</span>
                {/* Arrow SVG next to heading */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="inline-block h-4 w-4 shrink-0 ml-1 translate-y-px text-[color:var(--title)] group-hover:text-[color:var(--title-hover)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <span className="truncate">{projectName}</span>
            )}
          </h3>

          {/* Full-width image */}
          {image && (
            <div className="mt-3 overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={projectName} className="h-44 w-full object-cover md:h-52" loading="lazy" />
            </div>
          )}

          {/* Description */}
          <p className="mt-3 text-[0.78rem] leading-6 text-slate-300/90" style={{ color: colors.tertiary80 }}>
            {projectDesc}
          </p>

          {/* Footer pinned to bottom */}
          <div className="mt-auto pt-4 flex items-end justify-between">
            {/* Left bottom: GitHub icon */}
            <div>
              {code && (
                <Link
                  href={code}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-colors"
                  aria-label="View code on GitHub"
                  title="GitHub"
                  style={{ color: colors.tertiary }}
                  onClick={() => onClick?.(code)}
                >
                  <FiGithub className="text-[1.05rem]" />
                </Link>
              )}
            </div>

            {/* Right bottom: skills/tags */}
            {!!tags?.length && (
              <ul className="flex flex-wrap justify-end gap-1.5">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full px-2 py-[3px] text-[10px] ring-1"
                    style={{
                      color: "rgb(182 233 228)",
                      background: "rgba(20,184,166,0.12)",
                      borderColor: "rgba(45,212,191,0.2)",
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* hover ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1px ${colors.primary30} inset` }}
      />
    </article>
  );
}
