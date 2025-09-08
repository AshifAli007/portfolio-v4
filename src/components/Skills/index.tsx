"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { skillsData } from "@/data/skillsData";
import { skillsImage } from "@/utils/skillsImage";

type SkillsTheme = {
  primary: string;     // title color
  secondary: string;   // section bg + card bg
  tertiary: string;    // text inside cards
  primary30: string;   // glow shadow
};

type Props = {
  colors: SkillsTheme;
  title?: string;
  speed?: number; // marquee speed
};

export default function Skills({ colors, title = "Skills", speed = 80 }: Props) {
  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-start px-4 py-8 md:px-8"
      style={{ backgroundColor: colors.secondary }}
    >
      {/* Header */}
      <div className="flex items-center justify-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-center tracking-tight"
          style={{ color: colors.primary }}
        >
          {title}
        </h2>
      </div>

      {/* Marquee */}
      <div className="mt-8 w-full px-2 md:px-8">
        <div className="mx-4 w-full">
          <Marquee
            gradient={false}
            speed={speed}
            pauseOnHover
            pauseOnClick
            play
            direction="left"
            className="py-6"
          >
            {skillsData.map((skill, i) => {
              const icon = skillsImage(skill);
              return (
                <div
                  key={`${skill}-${i}`}
                  className="
                    m-6 flex h-40 w-40 flex-col items-center justify-center
                    rounded-xl p-6 transition-transform duration-300 ease-in-out
                    hover:scale-110
                  "
                  style={{
                    backgroundColor: colors.secondary,
                    boxShadow: `0 0 30px ${colors.primary30}`,
                  }}
                >
                  {icon && (
                    <img
                      src={icon}
                      alt={skill}
                      className="h-12 w-auto select-none pointer-events-none"
                    />
                  )}
                  <h3
                    className="mt-4 text-lg font-medium text-center"
                    style={{ color: colors.tertiary }}
                  >
                    {skill}
                  </h3>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
}