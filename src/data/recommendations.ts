import type { Recommendation } from "@/components/Recommendation/types";

const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    authorName: "Priya Sharma",
    authorTitle: "Product Manager at FinTech Labs",
    avatarUrl: "https://avatars.githubusercontent.com/u/000000?v=4",
    text: "Collaborating with Ashif on our analytics dashboard was a masterclass in thoughtful engineering. He translated vague product asks into elegant, performant components, and raised important edge cases before they became issues. He’s the teammate you want when timelines are tight but quality can’t slip.",
    sourceUrl: "https://www.linkedin.com/in/mohammad-ashif-cv/",
    date: "2024",
  },
  {
    id: "rec-2",
    authorName: "Luis Fernandez",
    authorTitle: "Senior Software Engineer, Cloud Platform",
    text: "Ashif combines deep frontend expertise with an instinct for user experience. He refactored our design system tokens to be themeable, reduced bundle size, and added accessibility wins in the process. His documentation made onboarding new contributors a breeze.",
    sourceUrl: "https://www.linkedin.com/in/mohammad-ashif-cv/",
    date: "2023",
  },
];

export default recommendations;
