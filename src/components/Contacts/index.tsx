"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    FaTwitter, FaLinkedinIn, FaGithub, FaYoutube, FaBloggerB, FaRedditAlien,
    FaStackOverflow, FaCodepen, FaInstagram, FaGitlab, FaMediumM
} from "react-icons/fa";
import { AiOutlineSend, AiOutlineCheckCircle } from "react-icons/ai";
import { FiPhone, FiAtSign } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { socialsData } from "@/data/socialData";
import { contactsData } from "@/data/contactsData";
// If you have a Footer component, uncomment this import and render it at the end
// import Footer from "@/components/Footer/Footer";

type ThemeColors = {
    primary: string;
    secondary: string;
    tertiary: string;
    tertiary80?: string;
    // Optional shades (we’ll gracefully fall back if omitted)
    primary30?: string;
};

type Props = {
    id?: string;
    colors: ThemeColors;
};

const emailOk = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function Contacts({ id = "contacts", colors }: Props) {
    const [open, setOpen] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    // auto-hide toast
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => setOpen(false), 4000);
        return () => clearTimeout(t);
    }, [open]);

    const borderShadow = useMemo(
        () => `0 0 30px ${colors.primary30 ?? "rgba(0,0,0,0.25)"}`,
        [colors.primary30]
    );

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
            } catch (err) {
                setErrMsg("Failed to send. Please try again later.");
                setOpen(true);
            }
        } else {
            // No sheetAPI configured – simulate success
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
                    className="grid place-items-center rounded-full w-[45px] h-[45px] text-[21px] transition-transform"
                    style={{ backgroundColor: colors.primary, color: colors.secondary }}
                >
                    {children}
                </a>
            ) : null;

    return (
        <section
            id={id}
            className="relative min-h-screen flex flex-col"
            style={{
                backgroundColor: colors.secondary,
                backgroundImage: "url(/svg/earth.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom",
                backgroundSize: "contain",
                backgroundBlendMode: "luminosity",
            }}
        >
            {/* Toast (replaces MUI Snackbar) */}
            {open && (
                <div
                    className="fixed top-4 left-1/2 z-[200] -translate-x-1/2 rounded-md px-4 py-2 shadow"
                    style={{ backgroundColor: colors.primary, color: colors.secondary }}
                    role="alert"
                >
                    {errMsg}
                </div>
            )}

            <div className="w-full px-8 md:px-16 lg:px-24 mt-8 md:mt-10">
                <h1
                    className="mb-8 text-3xl md:text-4xl font-semibold"
                    style={{ color: colors.primary }}
                >
                    Contacts
                </h1>

                <div className="flex flex-col lg:flex-row items-start gap-10">
                    {/* Form */}
                    <div className="w-full lg:w-2/5">
                        <form onSubmit={handleContactForm} className="flex flex-col">
                            {/* Name */}
                            <label
                                htmlFor="name"
                                className="mb-1 inline-flex text-sm font-semibold"
                                style={{ color: colors.primary }}
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=""
                                className="mb-5 rounded-2xl px-3 py-3 outline-none transition"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    boxShadow: borderShadow,
                                }}
                            />

                            {/* Email */}
                            <label
                                htmlFor="email"
                                className="mb-1 inline-flex text-sm font-semibold"
                                style={{ color: colors.primary }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=""
                                className="mb-5 rounded-2xl px-3 py-3 outline-none transition"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    boxShadow: borderShadow,
                                }}
                            />

                            {/* Message */}
                            <label
                                htmlFor="message"
                                className="mb-1 inline-flex text-sm font-semibold"
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
                                className="mb-6 rounded-2xl px-3 py-3 outline-none transition"
                                style={{
                                    backgroundColor: colors.secondary,
                                    color: colors.tertiary,
                                    border: `2px solid ${colors.primary}`,
                                    boxShadow: borderShadow,
                                }}
                            />

                            {/* Submit */}
                            <div className="flex">
                                <button
                                    type="submit"
                                    className="flex h-[50px] w-[140px] items-center justify-evenly rounded-full font-medium transition-transform"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.secondary,
                                    }}
                                    onMouseDown={() => setSuccess(false)}
                                >
                                    <p className="text-[16px]"> {!success ? "Send" : "Sent"} </p>
                                    <div className="grid place-items-center p-1.5">
                                        <AiOutlineSend
                                            className="send-icon"
                                            style={{
                                                fontSize: 25,
                                                transformOrigin: "center",
                                                transform: "translate(5px,-3px) rotate(-30deg)",
                                                animation: success ? "fly 0.8s linear both" : "none",
                                                position: success ? "absolute" as const : "initial",
                                            }}
                                        />
                                        <AiOutlineCheckCircle
                                            className="success-icon"
                                            style={{
                                                fontSize: 28,
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
                    <div className="w-full lg:w-3/5 lg:pl-24">
                        {/* Email */}
                        <a
                            href={`mailto:${contactsData.email}`}
                            className="mb-6 flex items-center"
                        >
                            <div
                                className="grid h-[45px] w-[45px] flex-shrink-0 place-items-center rounded-full text-[23px] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <FiAtSign />
                            </div>
                            <p
                                className="ml-4 text-[18px] font-medium leading-tight break-words"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.email}
                            </p>
                        </a>

                        {/* Phone */}
                        <a href={`tel:${contactsData.phone}`} className="mb-6 flex items-center">
                            <div
                                className="grid h-[45px] w-[45px] flex-shrink-0 place-items-center rounded-full text-[23px] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <FiPhone />
                            </div>
                            <p
                                className="ml-4 text-[18px] font-medium leading-tight break-words"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.phone}
                            </p>
                        </a>

                        {/* Address */}
                        <div className="mb-6 flex items-center">
                            <div
                                className="grid h-[45px] w-[45px] flex-shrink-0 place-items-center rounded-full text-[23px] transition-transform"
                                style={{ backgroundColor: colors.primary, color: colors.secondary }}
                            >
                                <HiOutlineLocationMarker />
                            </div>
                            <p
                                className="ml-4 text-[18px] font-medium leading-tight break-words"
                                style={{ color: colors.tertiary }}
                            >
                                {contactsData.address}
                            </p>
                        </div>

                        {/* Socials */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                            <SocialIcon href={socialsData.twitter} label="Twitter">
                                <FaTwitter />
                            </SocialIcon>
                            <SocialIcon href={socialsData.github} label="GitHub">
                                <FaGithub />
                            </SocialIcon>
                            <SocialIcon href={socialsData.linkedIn} label="LinkedIn">
                                <FaLinkedinIn />
                            </SocialIcon>
                            <SocialIcon href={socialsData.instagram} label="Instagram">
                                <FaInstagram />
                            </SocialIcon>
                            <SocialIcon href={socialsData.medium} label="Medium">
                                <FaMediumM />
                            </SocialIcon>
                            <SocialIcon href={socialsData.blogger} label="Blogger">
                                <FaBloggerB />
                            </SocialIcon>
                            <SocialIcon href={socialsData.youtube} label="YouTube">
                                <FaYoutube />
                            </SocialIcon>
                            <SocialIcon href={socialsData.reddit} label="Reddit">
                                <FaRedditAlien />
                            </SocialIcon>
                            <SocialIcon href={socialsData.stackOverflow} label="Stack Overflow">
                                <FaStackOverflow />
                            </SocialIcon>
                            <SocialIcon href={socialsData.codepen} label="CodePen">
                                <FaCodepen />
                            </SocialIcon>
                            <SocialIcon href={socialsData.gitlab} label="GitLab">
                                <FaGitlab />
                            </SocialIcon>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional footer if you have one */}
            {/* <Footer /> */}

            {/* Styled-JSX for the fly animation (keeps your effect) */}
            <style jsx>{`
        @keyframes fly {
          10% { transform: rotate(0deg); }
          20% { transform: translateX(-10px); }
          70% { transform: translateX(60px); }
          100% { transform: translateX(80px); }
        }
      `}</style>
        </section>
    );
}