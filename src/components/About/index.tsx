"use client";

import React from "react";

type ThemeColors = {
    primary: string;
    secondary: string;
    tertiary80: string;
};

type AboutProps = {
    id?: string;
    imgSrc?: string;
    colors?: ThemeColors;
};

// Inlined data
const aboutData = {
    title: "About Me",
    description1:
        "I'm a developer passionate about crafting accessible, pixel-perfect user interfaces that blend thoughtful design with robust engineering. My favorite work lies at the intersection of design and development, creating experiences that not only look great but are meticulously build for performance and usability.",
    description2:
        "In the past few years, I've worked with a variety of clients, from startups to large corporations, to create engaging digital experiences.",
    description3:
        "In my free time, I do calisthenics, practice jiu jitsu, and learn about space and physics.",
    image: 2,
};

export default function About({
    id = "about",
    imgSrc = "/about2.png",
    colors = {
        primary: "#89d3ce",
        secondary: "#000000",
        tertiary80: "#e0d9d9",
    },
}: AboutProps) {
    const { title, description1, description2, description3 } = aboutData;

    return (
        <section
            id={id}
            className="relative min-h-screen"
            style={{ backgroundColor: colors.secondary }}
        >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-5 pt-10 md:pt-16 lg:pt-20 lg:flex-row flex-col-reverse">
                {/* Text */}
                <div className="w-full lg:w-1/2">
                    <h2
                        className="mb-3 text-2xl md:text-3xl font-semibold tracking-tight"
                        style={{ color: colors.primary }}
                    >
                        {title}
                    </h2>

                    <div className="max-w-[65ch] space-y-4">
                        {description1 && (
                            <p
                                className="text-sm md:text-base leading-relaxed"
                                style={{ color: colors.tertiary80 }}
                            >
                                {description1}
                            </p>
                        )}
                        {description2 && (
                            <p
                                className="text-sm md:text-base leading-relaxed"
                                style={{ color: colors.tertiary80 }}
                            >
                                {description2}
                            </p>
                        )}
                        {description3 && (
                            <p
                                className="text-sm md:text-base leading-relaxed"
                                style={{ color: colors.tertiary80 }}
                            >
                                {description3}
                            </p>
                        )}
                    </div>
                </div>

                {/* Image */}
                <div className="pointer-events-none relative mt-8 lg:mt-0 lg:-left-[5%]">
                    <img
                        src={imgSrc}
                        alt="Portrait for About section"
                        className="w-[160px] sm:w-[100px] md:w-[140px] lg:w-[200px] rounded-[12px] object-cover"
                    />
                </div>
            </div>
        </section>
    );
}