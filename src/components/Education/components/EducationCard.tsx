"use client";

import React from "react";
import type { EducationItem } from "@/data/educationData";

export type EducationTheme = {
    primary: string;      // accent (chip bg, dates)
    primary30: string;    // card bg
    primary50: string;    // (optional) hover bg, we simulate via brightness
    tertiary: string;     // course color
    tertiary80: string;   // institution color
    type?: "light" | "dark";
};

type Props = {
    item: EducationItem;
    colors: EducationTheme;
};

export default function EducationCard({ item, colors }: Props) {
    const { startYear, endYear, course, institution } = item;
    const iconSrc =
        colors.type === "light"
            ? "/svg/education/eduImgBlack.svg"
            : "/svg/education/eduImgWhite.svg";

    return (
        <div
            className="
        group flex w-[90%] md:w-[90%] items-start justify-start
        rounded-2xl p-4 md:p-6 mb-4 md:mb-6 transition
        md:h-[140px] h-[130px]
        hover:brightness-110
      "
            style={{ backgroundColor: colors.primary30 }}
        >
            <div
                className="
          flex h-[45px] w-[45px] md:h-[55px] md:w-[55px]
          flex-shrink-0 items-center justify-center rounded-full
        "
                style={{ backgroundColor: colors.primary }}
            >
                <img src={iconSrc} alt="" className="h-[30px] w-[30px] md:h-10 md:w-10" />
            </div>

            <div className="ml-2 md:ml-3">
                <h6
                    className="mb-1 text-[0.85rem] font-bold"
                    style={{ color: colors.primary }}
                >
                    {startYear}-{endYear}
                </h6>
                <h4
                    className="text-[1.05rem] md:text-[1.225rem] font-semibold leading-[1.26]"
                    style={{ color: colors.tertiary }}
                >
                    {course}
                </h4>
                <h5
                    className="text-[1rem] md:text-[1.15rem] font-semibold leading-[1.26] opacity-90"
                    style={{ color: colors.tertiary80 }}
                >
                    {institution}
                </h5>
            </div>
        </div>
    );
}