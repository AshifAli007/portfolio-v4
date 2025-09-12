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
    projectName: "SynMob SmartCities",
    projectDesc:
      "Extended SynMob to generate synthetic GPS trajectories for Los Angeles and validated their use for congestion detection and traffic optimization.",
    tags: ["Python", "Django", "LSTM", "Machine Learning", "Algorithms"],
    code: "https://github.com/AshifAli007/synMob-smartCities",
    image: "/svg/newProjects/synmob.png",
  },
  {
    id: 2,
    projectName: "Octopusplus",
    projectDesc:
      "Sharded file-management system improving data availability and secure transactions with a React/Express/MongoDB stack.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Sharding", "Firebase", "MUI", "Axios"],
    code: "https://github.com/AshifAli007/octopusplus",
    demo: "https://octopusplus.netlify.app",
    image: "/svg/newProjects/octopusplus.png",
  },
  {
    id: 3,
    projectName: "Ingredia",
    projectDesc:
      "Recipe recommendations from on-hand ingredients with dietary/cuisine filters, saved recipes, reviews, and shopping lists.",
    tags: ["React", "Material UI", "Clerk", "Spoonacular API", "Netlify"],
    code: "https://github.com/AshifAli007/Ingredia",
    demo: "https://ingredia.netlify.app",
    image: "/svg/newProjects/ingredia.png",
  },
  {
    id: 4,
    projectName: "Galaxy",
    projectDesc: "Three.js particle-based web app for generative galaxy visuals.",
    tags: ["Three.js", "WebGL", "Particles"],
    code: "https://github.com/AshifAli007/TechnoTrove-Ashif/tree/newGalaxy",
    demo: "https://galaxy.ashifdesigns.com/",
    image: "/svg/newProjects/galaxy.png",
  },
  {
    id: 5,
    projectName: "Kepler (Bosler)",
    projectDesc:
      "Big-data visualization pages using React + Apache ECharts with filtering, dataset joins, dashboards, and theming.",
    tags: ["React", "Apache ECharts", "Redux", "Ant Design", "Lodash"],
    image: "/svg/newProjects/kepler.png",
  },
  {
    id: 6,
    projectName: "NetPrizm",
    projectDesc:
      "Front-end for simulating 5G towers and user equipment; maps, performance visualization, and analytics.",
    tags: ["React", "Redux", "Mapbox", "D3", "TypeScript", "MongoDB", "PostgreSQL"],
    image: "/svg/newProjects/netprizm.png",
  },
  {
    id: 7,
    projectName: "Portfolio v1",
    projectDesc:
      "Animated portfolio (2022) built with React and GSAP.",
    tags: ["React", "GSAP", "Animations"],
    code: "https://github.com/AshifAli007/journey",
    demo: "https://remarkable-mochi-fcc446.netlify.app/",
    image: "/svg/newProjects/portfolio.png",
  },
  {
    id: 8,
    projectName: "Techmarathon",
    projectDesc:
      "Platform to run multi-event college tech marathon; handled 2K+ users, auto result generation, and CI/CD.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Azure", "Firebase"],
    code: "https://github.com/AshifAli007/techMarathonFrontend",
    demo: "https://techmarathon2022.web.app/",
    image: "/svg/newProjects/techmarathon.png",
  },
  {
    id: 9,
    projectName: "Hack FSU",
    projectDesc:
            "A lightweight React app that turns any track into a responsive, sine-wave visual. As music plays, a neon “sin line” flexes in real time, creating an immersive, performance-friendly look",
    tags: ["React", "GSAP", "Geometry", "Maths"],
    demo: "https://hackfsu-acm-music-viz.netlify.app/",
    image: "/svg/newProjects/hackfsu.png",
    code: "https://github.com/AshifAli007/HackFSU-SPR24",
  },
  {
    id: 9,
    projectName: "Particles",
    projectDesc:
      "Created using css and javascript. Move mouse to create enlarged particles around the mouse.",
    tags: ["React", "GSAP", "Maths"],
    demo: "https://particle-interaction.netlify.app/",
    image: "/svg/newProjects/particles.png",
    code: "https://github.com/AshifAli007/particles",
  },
];