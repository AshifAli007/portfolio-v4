import type { Metadata } from "next";
import { Crimson_Pro, Source_Serif_4 } from "next/font/google";
import MathRouteShell from "@/components/Math/MathRouteShell";
import MathSiteHeader from "@/components/Math/MathSiteHeader";

const mathDisplay = Crimson_Pro({
  variable: "--font-math-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const mathSerif = Source_Serif_4({
  variable: "--font-math-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Math",
  description: "Math notes, equations, and interactive sketches (journal style).",
};

export default function MathLayout({ children }: { children: React.ReactNode }) {
  return (
    <MathRouteShell>
      <div
        className={`math-site-surface ${mathDisplay.variable} ${mathSerif.variable} font-[family-name:var(--font-math-serif)] text-stone-900 antialiased`}
      >
        <MathSiteHeader />
        {children}
      </div>
    </MathRouteShell>
  );
}
