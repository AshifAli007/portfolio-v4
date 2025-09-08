"use client";

import React from "react";
import ExperienceCard, { type ExperienceTheme } from "./components/ExperienceCard";
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
            style={{ backgroundColor: colors.secondary }}
        >
            <div
                className="
          mx-auto flex w-full max-w-6xl flex-row items-center justify-center
          px-4 md:px-6
        "
            >
                {/* Left image (hidden below lg, like your CSS) */}
                <div className="pointer-events-none hidden lg:block flex-[0.35] ml-[4.9%] mt-[0.7rem] box-border p-[0.7rem]">
                    <img
                        src="/svg/wormhole.svg"
                        alt=""
                        className="relative top-[28px] w-[80.5%] pointer-events-none"
                    />
                </div>

                {/* Right column: heading + cards */}
                <div
                    className="
            flex flex-col items-end justify-center
            w-full lg:flex-[0.65] p-[1.4rem] mr-[1.4rem]
          "
                >
                    <h1
                        className="
              mb-[1.4rem]
              text-[1.75rem] sm:text-[2.1rem] md:text-[2.24rem] lg:text-[2.45rem]
              font-semibold tracking-tight
            "
                        style={{ color: colors.primary }}
                    >
                        Experience
                    </h1>

                    {data.map((exp) => (
                        <ExperienceCard
                            key={exp.id} // or `${exp.company}-${exp.startYear}`
                            item={exp}
                            colors={colors}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}