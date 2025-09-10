"use client";

import React from "react";
import EducationCard, { type EducationTheme } from "./EducationCard";
import { educationData, type EducationItem } from "@/data/educationData";

type SectionTheme = EducationTheme & {
  secondary: string; // section background
};

type Props = {
  id?: string;
  data?: (EducationItem & Partial<{ href?: string; summary?: string; skills?: string[] }>)[]; // mirrors Experience usage
  colors: SectionTheme;
};

export default function Education({
  id = "education",
  data = educationData,
  colors,
}: Props) {
  return (
    <section
      id={id}
      className="min-h-[500px] w-full py-10"
      style={{ ["--section-bg" as string]: colors.secondary }} // keep your color var like Experience
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 flex flex-row items-start justify-center">
        {/* Left image (hidden below lg) – kept empty to match Experience layout */}
        <div className="pointer-events-none hidden lg:block flex-[0.35] ml-[4.9%] mt-[0.7rem] box-border p-[0.7rem]">
          {/* (Optional) decorative image goes here, mirroring Experience */}
        </div>

        {/* Right column */}
        <div className="flex flex-col items-start justify-start w-full lg:flex-[0.65] p-[1.4rem] mr-[1.4rem]">
          {/* Heading aligned to the card content column, just like Experience */}
          <h2
            className="self-start mb-[1.2rem]
                       text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] lg:text-[1.6rem]
                       font-semibold tracking-tight
                       pl-0 sm:pl-[0.8rem]"
            style={{ color: colors.primary }}
          >
            Education
          </h2>

          {data.map((edu) => (
            <EducationCard key={`${edu.institution}-${edu.startYear}`} item={edu} colors={colors} />
          ))}
        </div>
      </div>
    </section>
  );
}