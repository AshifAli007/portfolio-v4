"use client";

import React from "react";
import Link from "next/link";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { Project } from "@/data/projectsData";

type CardTheme = {
  primary: string;      // accents (outline, button bg)
  secondary: string;    // card bg
  tertiary: string;     // text
  primary30: string;    // glow/border
};

type Props = {
  project: Project;
  colors: CardTheme;
};

export default function ProjectCard({ project, colors }: Props) {
  const { projectName, projectDesc, tags, code, demo, image } = project;

  return (
    <article
      className="
        group relative flex w-full max-w-md flex-col overflow-hidden
        rounded-2xl border p-5 shadow-[0_10px_20px_rgba(0,0,0,0.12)]
        transition-transform duration-300 hover:-translate-y-1
      "
      style={{
        backgroundColor: colors.secondary,
        borderColor: colors.primary30,
        boxShadow: `0 0 30px ${colors.primary30}`,
      }}
    >
      <div className="mb-4 flex w-full items-center justify-center rounded-xl bg-black/20 p-6">
        <img src={image} alt={projectName} className="h-24 w-auto" />
      </div>

      <h3
        className="text-xl font-semibold tracking-tight"
        style={{ color: colors.tertiary }}
      >
        {projectName}
      </h3>

      <p className="mt-2 text-sm leading-relaxed opacity-85" style={{ color: colors.tertiary }}>
        {projectDesc}
      </p>

      {tags?.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li
              key={t}
              className="rounded-full px-2.5 py-1 text-xs"
              style={{
                color: colors.tertiary,
                border: `1px solid ${colors.primary30}`,
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center gap-3">
        {code && (
          <Link
            href={code}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition"
            style={{ border: `1px solid ${colors.primary}`, color: colors.tertiary }}
          >
            <FiGithub className="text-base" />
            Code
          </Link>
        )}
        {demo && (
          <Link
            href={demo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition"
            style={{ backgroundColor: colors.primary, color: colors.tertiary }}
          >
            <FiExternalLink className="text-base" />
            Demo
          </Link>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1px ${colors.primary30} inset` }}
      />
    </article>
  );
}