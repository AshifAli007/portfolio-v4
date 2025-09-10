// components/Experience.tsx
"use client";

import React from "react";
import ExperienceCard, { type ExperienceTheme } from "./ExperienceCard";
import { experienceData, type ExperienceItem } from "@/data/experienceData";

type SectionTheme = ExperienceTheme & {
    secondary: string; // section background
};

type Props = {
    id?: string;
    data?: ExperienceItem[];
    colors: SectionTheme;
};

export default function Experience({
    id = "experience",
    data = experienceData,
    colors,
}: Props) {
    return (
        <section
            id={id}
            className="min-h-screen"
            style={{ ['--section-bg' as any]: colors.secondary }}  // keep your color

        >
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6 flex flex-row items-start justify-center">
                {/* Left image (hidden below lg) */}
                <div className="pointer-events-none hidden lg:block flex-[0.35] ml-[4.9%] mt-[0.7rem] box-border p-[0.7rem]">
                    {/* <img src="/svg/wormhole.svg" alt="" className="relative top-[28px] w-[80.5%] pointer-events-none" /> */}
                </div>

                {/* Right column */}
                <div className="flex flex-col items-start justify-start w-full lg:flex-[0.65] p-[1.4rem] mr-[1.4rem]">
                    {/* 
            Align the heading with the job-title column inside each card (to the right of the date).
            Card internals: p-5 (1.25rem) + date col 8.5rem + gap-4 (1rem) = 10.75rem
            On mobile (<sm) cards collapse to 1 column, so we keep heading flush-left (pl-0).
          */}
                    <h2
                        className="self-start mb-[1.2rem]
             text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] lg:text-[1.6rem]
             font-semibold tracking-tight
             pl-0 sm:pl-[0.8rem]"
                        style={{ color: colors.primary }}
                    >
                        Experience
                    </h2>

                    {data.map((exp) => (
                        <ExperienceCard key={exp.id} item={exp} colors={colors} />
                    ))}
                </div>
            </div>
        </section>
    );
}