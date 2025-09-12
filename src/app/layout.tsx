// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseVars from "./MouseVars";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ashif",
    template: "%s | Ashif Ali",
  },
  description:
    "Crafting digital experiences with creativity, code, and curiosity. Explore my portfolio of web projects, design, and innovation.",
  // Favicon is served automatically from src/app/icon.png (or icon.svg)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MouseVars />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}