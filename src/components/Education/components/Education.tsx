"use client";

import React from "react";
import EducationCard, { type EducationTheme } from "./EducationCard";
import { educationData, type EducationItem } from "@/data/educationData";

type SectionTheme = EducationTheme & {
  secondary: string; // section background
};

type Props = {
  id?: string;
  data?: EducationItem[];
  colors: SectionTheme;
  /** Background SVG for the section center “glow”. Defaults to /svg/light2.svg */
  backgroundSvg?: string;
};

export default function Education({
  id = "resume",
  data = educationData,
  colors,
  backgroundSvg = "/svg/light2.svg",
}: Props) {
  return (
    <section
      id={id}
      className="min-h-screen"
      style={{ backgroundColor: colors.secondary }}
    >
      <div
        className="
          relative flex w-full items-center justify-end
          bg-no-repeat bg-center bg-contain
          "
        style={{ backgroundImage: `url(${backgroundSvg})` }}
      >
        <div className="mx-auto flex w-full flex-col items-end justify-center px-4 md:px-8 lg:px-10">
          <div className="mt-16 md:mt-20 lg:mt-24 flex w-full flex-col items-end justify-center lg:ml-[7%]">
            <h1
              className="mb-6 text-3xl md:text-4xl font-semibold tracking-tight"
              style={{ color: colors.primary }}
            >
              Education
            </h1>

            {data.map((edu) => (
              <EducationCard key={edu.id} item={edu} colors={colors} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}