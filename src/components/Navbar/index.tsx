"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";

type NavbarProps = {
  /** Override if your resume lives elsewhere. Put resume.pdf in /public for default. */
  resumeHref?: string;
};

export default function Navbar({ resumeHref = "/resume.pdf" }: NavbarProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const positionRef = useRef<HTMLHeadingElement | null>(null);
  const pathname = usePathname();
  const showSideNav = !pathname?.startsWith("/sports");

  const handleScrollToAbout: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top centered name + role (absolute, transparent) */}
      <div
        ref={container}
        className="absolute left-0 top-0 z-[99] flex w-full items-center justify-center bg-transparent h-20 sm:h-[6.5rem]"
      >
        <div className="mt-4 flex w-full flex-col items-center justify-between">
          <a
            href="https://333302723895496704.hello.cv"
            target="_blank"
            rel="noreferrer noopener"
            className="no-underline"
          >
            <h1
              ref={nameRef}
              className="cursor-pointer select-none font-medium text-[2.2rem] font-[var(--font-geist-mono)]"
              style={{ color: "#89d3ce" }}
            >
              M<span className="text-[1.7rem]">OHAMAMD</span> A<span className="text-[1.7rem]">SHIF</span>
            </h1>
          </a>

          <h4
            ref={positionRef}
            className="text-white text-[0.75rem] uppercase tracking-[0.1em]"
          >
            Software Engineer
          </h4>
        </div>
      </div>

      {/* Left vertical links with animated line */}
      {showSideNav && (
        <nav
          aria-label="Primary"
          className="absolute left-[4%] top-1/2 z-[100] -translate-y-1/2 bg-transparent"
        >
          <ul className="m-0 flex list-none flex-col items-start justify-center p-0 text-white">
            <li className="py-[0.55rem]">
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center text-white text-[0.75rem] uppercase tracking-[0.1em] no-underline"
              >
                <span className="mr-4 block h-px w-8 border border-white transition-all duration-150 ease-in-out group-hover:w-16" />
                <span>Resume</span>
              </a>
            </li>

            <li className="py-[0.55rem]">
              <a
                href="#about"
                onClick={handleScrollToAbout}
                className="group flex items-center text-white text-[0.75rem] uppercase tracking-[0.1em] no-underline"
              >
                <span className="mr-4 block h-px w-8 border border-white transition-all duration-150 ease-in-out group-hover:w-16" />
                <span>About</span>
              </a>
            </li>

            <li className="py-[0.55rem]">
              <a
                href="/sports"
                className="group flex items-center text-white text-[0.75rem] uppercase tracking-[0.1em] no-underline"
              >
                <span className="mr-4 block h-px w-8 border border-white transition-all duration-150 ease-in-out group-hover:w-16" />
                <span>Sports</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
