"use client";

import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full h-[60px] flex items-center justify-center"
      style={{ backgroundColor: "transparent" }}
    >
      <p className="font-light font-medium text-gray-400 font-[var(--font-geist-mono)]">
        Crafted with
        <span className="mx-2 align-middle text-[30px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/svg/coffee.svg" alt="coffee" loading="lazy" className="inline w-5 h-5 fill-red-500 relative bottom-1" />
        </span>
        by <span className="text-link">Ashif</span>
      </p>
    </footer>
  );
}
