"use client";

import React from "react";
import { projectsData, type Project } from "@/data/projectsData";
import ProjectCard from "@/components/Projects/ProjectCard";

type SectionTheme = {
  primary: string;
  secondary: string;
  tertiary: string;
  tertiary80: string;
  primary30: string;
};

type Props = {
  id?: string;
  data?: Project[];
  colors: SectionTheme;
  title?: string;
};

export default function Projects({
  id = "projects",
  data = projectsData,
  colors,
  title = "Projects",
}: Props) {
  // Mark which cards should be wide (horizontal layout) vs tall (vertical layout with extra height)
  const featuredWide = new Set<number>([1, 4, 8]); // wide (xl:col-span-2)
  const featuredTall = new Set<number>([2]);     // tall (row-span-2) — tweak as you like

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

            // Decide layout: horizontal if wide (and not explicitly tall), else vertical
            const layout: "horizontal" | "vertical" = isWide && !isTall ? "horizontal" : "vertical";

            return (
              <div key={project.id} className={[spanWide, spanTall].filter(Boolean).join(" ")}>
                <ProjectCard
                  project={project}
                  layout={layout}
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