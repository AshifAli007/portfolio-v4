"use client";

import React, { useEffect, useState } from "react";
import {
    FaTwitter, FaLinkedinIn, FaGithub, FaYoutube, FaBloggerB, FaRedditAlien,
    FaStackOverflow, FaCodepen, FaInstagram, FaGitlab, FaMediumM
} from "react-icons/fa";
import { AiOutlineSend, AiOutlineCheckCircle } from "react-icons/ai";
import { FiPhone, FiAtSign } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
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
    const [open, setOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => setOpen(false), 4000);
        return () => clearTimeout(t);
    }, [open]);

    async function handleContactForm(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setErrMsg("Enter all the fields");
            setOpen(true);
            return;
        }
        if (!emailOk(email)) {
            setErrMsg("Invalid email");
            setOpen(true);
            return;
        }

        if (contactsData.sheetAPI) {
            try {
                await fetch(contactsData.sheetAPI, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });
                setSuccess(true);
                setErrMsg("");
                setName("");
                setEmail("");
                setMessage("");
            } catch {
                setErrMsg("Failed to send. Please try again later.");
                setOpen(true);
            }
        } else {
            setSuccess(true);
            setErrMsg("");
            setName("");
            setEmail("");
            setMessage("");
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
            {open && (
                <div
                    className="fixed top-4 left-1/2 z-[200] -translate-x-1/2 rounded-md px-3 py-1.5 shadow text-[0.78rem]"
                    style={{ backgroundColor: colors.primary, color: colors.secondary }}
                    role="alert"
                >
                    {errMsg}
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


                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Form */}
                    <div className="w-full lg:w-2/5">
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
                                >
                                    <p className="text-[0.78rem]">{!success ? "Send" : "Sent"}</p>
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

                        {/* Address */}
                        <div className="mb-5 flex items-center">
                            <div
                                className="grid h-[28px] w-[28px] flex-shrink-0 place-items-center rounded-full text-[0.9rem] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <HiOutlineLocationMarker />
                            </div>
                            <p
                                className="ml-3 font-medium leading-tight break-words text-[0.78rem]"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.address}
                            </p>
                        </div>

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
      `}</style>
        </section>
    );
}