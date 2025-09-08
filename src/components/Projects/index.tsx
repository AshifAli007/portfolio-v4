"use client";

import React from "react";
import { projectsData, type Project } from "@/data/projectsData";
import ProjectCard from "./projectCard";

type SectionTheme = {
  primary: string;      // header color
  secondary: string;    // section bg
  tertiary: string;     // text
  primary30: string;    // glow/border
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
  title = "Projects Showcase",
}: Props) {
  // show ALL projects
  const all = data;

  return (
    <section
      id={id}
      className="min-h-screen overflow-x-hidden px-4 py-8 md:px-8"
      style={{ backgroundColor: colors.secondary }}
    >
      <header className="mx-auto my-4 flex w-full items-center justify-center">
        <h1
          className="mb-5 text-3xl md:text-4xl font-semibold tracking-tight text-center"
          style={{ color: colors.primary }}
        >
          {title}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center">
        <div className="grid w-full gap-8 md:gap-12 lg:gap-[4.5rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {all.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              colors={{
                primary: colors.primary,
                secondary: colors.secondary,
                tertiary: colors.tertiary,
                primary30: colors.primary30,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}