import type { Recommendation } from "@/components/Recommendation/types";

const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    authorName: "Jose Andres Arita",
    authorTitle: "Jr Manufacturing Engineer, Powermatic Associates",
    avatarUrl: "https://avatars.githubusercontent.com/u/000000?v=4",
    text: "I worked with Ashif on a project at Florida State. We had to build a real-time dashboard that pulled data from several sources and showed it in a clean web app. Ashif set up the whole stack AWS on the back end, React on the front end, and a smooth API in between. He broke down complex tasks into clear steps, shared quick updates, and always kept us on schedule. When the data feed broke two days before our demo, he traced the bug, patched the code, and redeployed in one evening. Ashif’s code is tidy, his problem-solving is fast, and he explains things in plain language. Working with him felt easy and steady. I’d team up with him again without hesitation.",
    sourceUrl: "https://www.linkedin.com/in/mohammad-ashif-cv/",
    date: "2024",
  },
  {
    id: "rec-2",
    authorName: "Asma Khanam",
    authorTitle: "Senior Software Engineer",
    text: "Ashif combines deep frontend expertise with an instinct for user experience. He refactored our design system tokens to be themeable, reduced bundle size, and added accessibility wins in the process. His documentation made onboarding new contributors a breeze.",
    sourceUrl: "https://www.linkedin.com/in/mohammad-ashif-cv/",
    date: "2023",
  },
];

export default recommendations;
