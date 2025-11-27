"use client";

import React, { useEffect, useState } from "react";
import {
    FaTwitter, FaLinkedinIn, FaGithub, FaYoutube, FaBloggerB, FaRedditAlien,
    FaStackOverflow, FaCodepen, FaInstagram, FaGitlab, FaMediumM
} from "react-icons/fa";
import { AiOutlineSend, AiOutlineCheckCircle } from "react-icons/ai";
import { FiPhone, FiAtSign } from "react-icons/fi";
import { socialsData } from "@/data/socialData";
import { contactsData } from "@/data/contactsData";
import Map from "./map";

type ThemeColors = {
    primary: string;
    secondary: string;
    tertiary: string;
    tertiary80?: string;
    primary30?: string;
};

type Props = {
    id?: string;
    colors: ThemeColors;
};

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function Contacts({ id = "contacts", colors }: Props) {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [hoverPos, setHoverPos] = useState(50);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!toastOpen) return;
        const t = setTimeout(() => setToastOpen(false), 3000);
        return () => clearTimeout(t);
    }, [toastOpen]);

    async function handleContactForm(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setToastMsg("Enter all the fields");
            setToastOpen(true);
            return;
        }
        if (!emailOk(email)) {
            setToastMsg("Invalid email");
            setToastOpen(true);
            return;
        }

        setIsSubmitting(true);
        setSuccess(false);
        try {
            const meta = typeof window !== "undefined" ? { page: window.location.pathname } : undefined;
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message, meta }),
            });
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to send. Please try again later.");
            }
            setSuccess(true);
            setToastMsg("Message sent! Thanks for reaching out. Please check your inbox (and spam folder) for a confirmation email.");
            setToastOpen(true);
            setName("");
            setEmail("");
            setMessage("");
        } catch (error) {
            setToastMsg((error as Error)?.message ?? "Failed to send. Please try again later.");
            setToastOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    const SocialIcon: React.FC<{
        href?: string;
        label: string;
        children: React.ReactNode;
    }> = ({ href, label, children }) =>
            href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid place-items-center rounded-full w-[38px] h-[38px] text-[0.78rem] transition-transform"
                    style={{ backgroundColor: colors.primary, color: colors.secondary }}
                    onClick={() =>
                        fetch("/api/analytics/track", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ event: "social_click", target: label, page: "contacts" }),
                            keepalive: true,
                        }).catch(() => {})
                    }
                >
                    {children}
                </a>
            ) : null;

    return (
        <section
            id={id}
            className="relative min-h-screen flex flex-col text-[0.78rem] md:text-[0.78rem] mt-40"
        // style={{
        //     backgroundColor: colors.secondary, // background image removed
        // }}
        >
            {/* Toast */}
            {toastOpen && (
                <div
                    className="fixed top-4 left-1/2 z-[200] -translate-x-1/2 rounded-md px-3 py-2 shadow text-[0.78rem] backdrop-blur transition-transform animate-[fadeSlide_300ms_ease]"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.secondary,
                    }}
                    role="status"
                    aria-live="polite"
                >
                    {toastMsg}
                </div>
            )}

            <div className="w-full px-6 md:px-12 lg:px-20 mt-6 md:mt-8">
                <h1
                    className="mb-6 font-semibold leading-tight"
                    style={{ color: colors.primary, fontSize: "1.6rem" }}
                >
                    Get In Touch!
                    <p className="text-[0.78rem] text-gray-400">{"Let's "} <span className="text-link">create</span> something together</p>
                </h1>

                <div
                    className="mb-8 block w-fit ml-auto rounded-2xl bg-white/5 p-4 text-right text-lg font-semibold text-white shadow-lg backdrop-blur"
                    style={{
                        background: `linear-gradient(90deg, rgba(137,211,206,0.15) ${hoverPos - 50}%, ${colors.primary} ${hoverPos}%, rgba(137,211,206,0.15) ${hoverPos + 20}%)`,
                        color: "transparent",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        transition: "background-position 200ms ease",
                    }}
                >
                    “Love is the one thing that transcends time and space.”
                    <div className="mt-1 text-xs text-slate-400">— Interstellar</div>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Form */}
                    <div className="w-full lg:w-2/5">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.78rem] text-slate-200 shadow-sm">
                            <span className="font-semibold" style={{ color: colors.primary }}>New</span>
                            <a
                                href="/analytics"
                                className="underline-offset-2 transition hover:text-white"
                                onClick={() =>
                                    fetch("/api/analytics/track", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ event: "page_view", page: "/analytics" }),
                                        keepalive: true,
                                    }).catch(() => {})
                                }
                            >
                                View site analytics
                            </a>
                        </div>
                        <form onSubmit={handleContactForm} className="flex flex-col">
                            {/* Name */}
                            <label
                                htmlFor="name"
                                className="mb-1 inline-flex text-[0.78rem] font-semibold"
                                style={{ color: colors.primary }}
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mb-4 rounded-2xl px-3 py-2 outline-none transition text-[0.78rem]"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    // boxShadow: borderShadow,
                                }}
                            />

                            {/* Email */}
                            <label
                                htmlFor="email"
                                className="mb-1 inline-flex text-[0.78rem] font-semibold"
                                style={{ color: colors.primary }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-4 rounded-2xl px-3 py-2 outline-none transition text-[0.78rem]"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    // boxShadow: borderShadow,
                                }}
                            />

                            {/* Message */}
                            <label
                                htmlFor="message"
                                className="mb-1 inline-flex text-[0.78rem] font-semibold"
                                style={{ color: colors.primary }}
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                placeholder="Type your message..."
                                className="mb-5 rounded-2xl px-3 py-2 outline-none transition text-[0.78rem]"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    // boxShadow: borderShadow,
                                }}
                            />

                            {/* Submit */}
                            <div className="flex">
                                <button
                                    type="submit"
                                    className="flex h-[32px] w-[80px] items-center justify-evenly rounded-full font-medium transition-transform"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.secondary,
                                    }}
                                    onMouseDown={() => setSuccess(false)}
                                    disabled={isSubmitting}
                                >
                                    <p className="text-[0.78rem]">
                                        {isSubmitting ? "Sending" : !success ? "Send" : "Sent"}
                                    </p>
                                    <div className="grid place-items-center p-1">
                                        <AiOutlineSend
                                            className="send-icon"
                                            style={{
                                                fontSize: "0.78rem",
                                                transformOrigin: "center",
                                                transform: "translate(3px,-2px) rotate(-30deg)",
                                                animation: success ? "fly 0.8s linear both" : "none",
                                                position: success ? ("absolute" as const) : "initial",
                                            }}
                                        />
                                        <AiOutlineCheckCircle
                                            className="success-icon"
                                            style={{
                                                fontSize: "0.78rem",
                                                display: success ? "inline-flex" : "none",
                                                opacity: success ? 1 : 0,
                                                transition: "all .3s .8s ease-in-out",
                                            }}
                                        />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Details + Socials */}
                    <div className="w-full lg:w-3/5 lg:pl-16">
                        {/* Email */}
                        <a href={`mailto:${contactsData.email}`} className="mb-5 flex items-center">
                            <div
                                className="grid h-[28px] w-[28px] flex-shrink-0 place-items-center rounded-full text-[0.9rem] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <FiAtSign />
                            </div>
                            <p
                                className="ml-3 font-medium leading-tight break-words text-[0.78rem]"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.email}
                            </p>
                        </a>

                        {/* Phone */}
                        <a href={`tel:${contactsData.phone}`} className="mb-5 flex items-center">
                            <div
                                className="grid h-[28px] w-[28px] flex-shrink-0 place-items-center rounded-full text-[0.9rem] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <FiPhone />
                            </div>
                            <p
                                className="ml-3 font-medium leading-tight break-words text-[0.78rem]"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.phone}
                            </p>
                        </a>



                        {/* Socials */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                            <SocialIcon href={socialsData.twitter} label="Twitter">
                                <FaTwitter size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.github} label="GitHub">
                                <FaGithub size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.linkedIn} label="LinkedIn">
                                <FaLinkedinIn size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.instagram} label="Instagram">
                                <FaInstagram size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.medium} label="Medium">
                                <FaMediumM size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.blogger} label="Blogger">
                                <FaBloggerB size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.youtube} label="YouTube">
                                <FaYoutube size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.reddit} label="Reddit">
                                <FaRedditAlien size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.stackOverflow} label="Stack Overflow">
                                <FaStackOverflow size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.codepen} label="CodePen">
                                <FaCodepen size={15} />
                            </SocialIcon>
                            <SocialIcon href={socialsData.gitlab} label="GitLab">
                                <FaGitlab size={15} />
                            </SocialIcon>
                        </div>
                        <div className="mt-10">
                            <Map height={280}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* fly animation */}
            <style jsx>{`
        @keyframes fly {
          10% { transform: rotate(0deg); }
          20% { transform: translateX(-8px); }
          70% { transform: translateX(46px); }
          100% { transform: translateX(62px); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
        </section>
    );
}
