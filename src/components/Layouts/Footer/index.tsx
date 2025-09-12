"use client";

import React from "react";
// import { useTheme } from "@/contexts/ThemeContext";

export default function Footer() {
  //   const { theme } = useTheme();

  return (
    <footer
      className="w-full h-[60px] flex items-center justify-center"
      style={{ backgroundColor: "transparent" }}
    >
      <p
        className="font-light text-gray-300 font-medium text-gray-400 font-[var(--font-geist-mono)]"
        // If you’ve loaded "kallisto", Tailwind will use it. Otherwise it falls back.
        // style={{ fontFamily: "kallisto, sans-serif" }}
      >
        Crafted with
        <span
          className="mx-2 align-middle text-[30px]"
          style={{}}
        >

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={"/svg/coffee.svg"} alt="coffee" className="inline w-5 h-5 fill-red-500 relative bottom-1" />
        </span>

        by <span className="text-link">Ashif</span>
      </p>
    </footer>
  );
}