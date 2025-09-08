"use client";

import React from "react";
import type { ExperienceItem } from "@/data/experienceData";

export type ExperienceTheme = {
  type?: "light" | "dark";
  primary: string;      // accents (chip bg, date text, heading)
  primary30: string;    // card bg
  tertiary: string;     // job title
  tertiary80: string;   // company
};

type Props = {
  item: ExperienceItem;
  colors: ExperienceTheme;
};

export default function ExperienceCard({ item, colors }: Props) {
  const iconSrc =
    colors.type === "light"
      ? "/svg/experience/expImgBlack.svg"
      : "/svg/experience/expImgWhite.svg";

  return (
    <div
      className="
        group mb-[1.05rem] flex w-[90%] items-start justify-start
        rounded-[14px] p-[1.05rem] transition duration-200
        h-[91px] lg:h-[98px] hover:brightness-[1.1]
      "
      style={{ backgroundColor: colors.primary30 }}
    >
      <div
        className="
          flex flex-shrink-0 items-center justify-center rounded-full
          w-[31.5px] h-[31.5px] lg:w-[38.5px] lg:h-[38.5px]
        "
        style={{ backgroundColor: colors.primary }}
      >
        <img
          src={iconSrc}
          alt=""
          className="pointer-events-none w-[21px] lg:w-[25.2px]"
        />
      </div>

      <div className="ml-[0.42rem]">
        <h6
          className="mb-[0.35rem] text-[0.595rem] font-bold"
          style={{ color: colors.primary }}
        >
          {item.startYear}-{item.endYear}
        </h6>

        <h4
          className="text-[0.7875rem] lg:text-[0.8575rem] font-semibold"
          style={{ color: colors.tertiary }}
        >
          {item.jobtitle}
        </h4>

        <h5
          className="text-[0.735rem] lg:text-[0.805rem] font-semibold"
          style={{ color: colors.tertiary80 }}
        >
          {item.company}
        </h5>
      </div>
    </div>
  );
}