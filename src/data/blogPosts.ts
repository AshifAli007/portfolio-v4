export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date string YYYY-MM-DD */
  date: string;
  excerpt: string;
  tag?: string;
};

/** Ordered newest first. */
export const blogPosts: BlogPost[] = [
  {
    slug: "affirmations",
    title: "Morning Affirmations by Theme",
    date: "2026-11-01",
    excerpt:
      "Fifty short affirmations for motivation, stress, abundance, focus, and gratitude. Pick one or two when you need them.",
    tag: "Mindset",
  },
  {
    slug: "lorenz",
    title: "The Lorenz attractor",
    date: "2026-04-12",
    excerpt:
      "Three equations, deterministic chaos, and why a tiny change in where you start can send the trajectory somewhere completely different, shown in 3D.",
    tag: "Dynamical systems",
  },
  {
    slug: "quadratic",
    title: "Quadratic preview",
    date: "2026-04-11",
    excerpt:
      "Move the coefficients and watch the parabola, axes, and equation update together.",
    tag: "Algebra",
  },
];
