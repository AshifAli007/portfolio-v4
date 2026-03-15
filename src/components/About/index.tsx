// components/About.tsx
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

export default function About({
    id = "about",
    imgSrc = "/about2.png",
    colors = {
        primary: "#89d3ce",
        secondary: "#000000",
        tertiary80: "#e0d9d9",
    },
}: AboutProps) {
    return (
        <section
            id={id}
            className="min-h-screen"
            style={{ ['--section-bg' as string]: colors.secondary }}
        >
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 pt-10 md:pt-16 lg:pt-20">
                {/* Text */}
                <div className="w-full lg:w-1/2">
                    <h2
                        className="self-start mb-[1.2rem]
                       text-[1rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.6rem]
                       font-semibold tracking-tight"
                        style={{ color: colors.primary }}
                    >
                        About Me
                    </h2>

                    <div className="max-w-[65ch] space-y-4 text-gray-400 font-medium font-about">
                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            {"I'm"} Ashif, M.S. in Computer Science from Florida State
                            University, with over six years of software engineering
                            across <span className="text-link">AI, cloud infrastructure, and full-stack development</span>. I love
                            building systems that work at scale, whether {"that's"} voice AI agents
                            handling real-time conversations or distributed pipelines syncing
                            hundreds of thousands of records.
                        </p>

                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            Currently at Liberate Innovation, I build production{" "}
                            <span className="text-link">voice AI agents</span> using multi-agent
                            orchestration and NLP-driven conversation flows. I designed a workflow
                            that cut agent build time from 8-10 days to under 1 day (a 10x
                            acceleration) and built reusable skills and tooling adopted across
                            the engineering team.
                        </p>

                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            Before that, I worked as an Integration Engineer at BigCommerce
                            connecting platforms with <span className="text-link">AWS systems</span>, shipped
                            microfrontend components at Dell Technologies, and built data-intensive
                            telecom applications at Amantya Technologies. Each role sharpened a
                            different edge: <span className="text-link">distributed systems, performance
                            optimization, and scalable architecture</span>.
                        </p>

                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            Outside work, I recharge with calisthenics
                            {" and jiu-jitsu, and I'm endlessly curious about space and physics."}
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div className="pointer-events-none relative mt-6 lg:mt-0 lg:-left-[10%]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgSrc}
                        alt="Portrait for About section"
                        loading="lazy"
                        className="w-[100px] sm:w-[130px] md:w-[180px] lg:w-[200px] rounded-[12px] object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
