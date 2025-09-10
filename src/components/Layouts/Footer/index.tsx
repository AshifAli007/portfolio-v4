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
        className="font-light text-gray-300"
        // If you’ve loaded "kallisto", Tailwind will use it. Otherwise it falls back.
        style={{ fontFamily: "kallisto, sans-serif" }}
      >
        Made with
        <span
          className="mx-2 align-middle text-[30px]"
          style={{}}
        >
          ☕
        </span>
        by Ashif
      </p>
    </footer>
  );
}