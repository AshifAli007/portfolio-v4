// data/projectsData.ts
export type Project = {
  id: number;
  projectName: string;
  projectDesc: string;
  tags: string[];
  code?: string;
  demo?: string;
  image: string; // public path
};

export const projectsData: Project[] = [
  {
    id: 1,
    projectName: "Particle",
    projectDesc: "A simple project with CSS and vanilla JS to create a particle effect.",
    tags: ["SCSS", "Javascript"],
    code: "https://github.com/AshifAli007/particles",
    demo: "https://particle-interaction.netlify.app/",
    image: "/svg/projects/particle.svg",
  },
  {
    id: 2,
    projectName: "Techmarathon",
    projectDesc:
      "Built a platform for the Techmarathon event for our college Annual Event.",
    tags: ["NodeJS", "ReactJS", "MongoDB", "Firebase"],
    code: "https://github.com/AshifAli007/techMarathonFrontend",
    demo: "https://techmarathon2022.web.app/",
    image: "/svg/projects/techmarathon.svg",
  },
  {
    id: 3,
    projectName: "Break Through Code",
    projectDesc:
      "This website is for an event in ACM chapter DDUC named Choices; built using React and deployed on Netlify.",
    tags: ["React", "Flexbox", "JQuery", "Netlify"],
    code: "https://github.com/AshifAli007/breakthrucode",
    demo: "https://lucid-wozniak-9af02b.netlify.app/event",
    image: "/svg/projects/break.svg",
  },
  {
    id: 4,
    projectName: "C.O.S.M.A",
    projectDesc:
      "A project I always wanted to build; working to expand features and controls via Bluetooth and Wi-Fi.",
    tags: ["XML", "Speech recognition"],
    code: "https://github.com/AshifAli007/J.A.R.V.I.S",
    demo: "https://youtu.be/cqvnFe9QfHA",
    image: "/svg/projects/cosma.svg",
  },
  {
    id: 5,
    projectName: "F Music",
    projectDesc: "A Music Streaming App using Javascript only.",
    tags: ["NodeJS", "EJS", "ExpressJS", "MongoDB"],
    code: "https://github.com/AshifAli007/fMusic",
    demo: "https://f-music-791bede66a54.herokuapp.com/",
    image: "/svg/projects/fMusic.svg",
  },
  {
    id: 6,
    projectName: "Incredible India",
    projectDesc:
      "A platform for campers to see the beauty of India and book camping spots.",
    tags: ["NodeJS", "EJS"],
    code: "https://github.com/AshifAli007/Incredible-India",
    demo: "https://incredibleindia-d61c43080530.herokuapp.com/",
    image: "/svg/projects/incredible.svg",
  },
  {
    id: 7,
    projectName: "Stock Market App",
    projectDesc: "A simple stock market API app.",
    tags: ["React", "Redux", "Bootstrap"],
    image: "/svg/projects/seven.svg",
  },
  {
    id: 8,
    projectName: "Car Pooling System",
    projectDesc:
      "Carpooling platform that helps people share rides, meet others, and reduce pollution.",
    tags: ["Flutter", "React"],
    image: "/svg/projects/eight.svg",
  },
];