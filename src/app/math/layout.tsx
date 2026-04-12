import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math",
  description: "Notes, equations, and interactive explorations from what I'm learning in math.",
};

export default function MathLayout({ children }: { children: React.ReactNode }) {
  return children;
}
