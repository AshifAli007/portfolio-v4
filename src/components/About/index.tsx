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
            style={{ ['--section-bg' as any]: colors.secondary }}  // keep your color

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
                            {/* <a
                                className="text-link"
                                href="https://www.klaviyo.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="Klaviyo (opens in a new tab)"
                            >
                                Klaviyo
                            </a>{" "} */}
                            I’m Ashif, recent M.S. in Computer Science from Florida State
                            University, with about five years of hands-on software engineering
                            across <span className="text-link">frontend, backend, and cloud</span>. I love the craft of shipping
                            interfaces that feel effortless while being engineered for
                            reliability and performance. I learn fast, and move teams toward a
                            shared goal.
                        </p>

                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            Most recently at BigCommerce, I worked as an Integration Engineer
                            connecting external platforms with internal <span className="text-link">AWS systems</span>. I built
                            and hardened data exchanges and syncs. That experience also
                            sharpened my Agile instincts: clear tickets, tight feedback loops
                            in Jira, and crisp comms with CRM, security, and platform teams.
                        </p>

                        <p className="text-[0.85rem] leading-5 md:leading-6">
                            Before that I shipped production code on Dell’s subscriptions
                            platform, where <span className="text-link">micro-frontend architecture</span> taught me a lot about
                            <span className="text-link"> isolation, reliability, performance</span>, and writing scalable code. At Amantya
                            Technologies, our telecom product (NetPrizm) rendered 5G towers
                            and user equipment at city scale. I partnered with the team to
                            optimize bundling, lean on animation strategies, and add MongoDB
                            indexing to keep performance smooth as we scaled.
                        </p>

                        <p
                            className="text-[0.85rem] leading-5 md:leading-6"

                        >
                            Outside work, I recharge with calisthenics
                            and jiu-jitsu, and I’m endlessly curious about space and physics.
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div className="pointer-events-none relative mt-6 lg:mt-0 lg:-left-[10%]">
                    <img
                        src={imgSrc}
                        alt="Portrait for About section"
                        className="w-[100px] sm:w-[130px] md:w-[180px] lg:w-[200px] rounded-[12px] object-cover"
                    />
                </div>
            </div>
        </section>
    );
}