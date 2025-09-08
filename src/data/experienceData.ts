// data/experienceData.ts
export type ExperienceItem = {
    id: number;
    company: string;
    jobtitle: string;
    startYear: string;
    endYear: string;
};

export const experienceData: ExperienceItem[] = [
    {
        id: 1,
        company: "BigCommerce",
        jobtitle: "AWS Integration Intern",
        startYear: "May 2024",
        endYear: "Dec 2024",
    },
    {
        id: 2,
        company: "Dell Technologies",
        jobtitle: "Front-End Developer",
        startYear: "Jan 2023",
        endYear: "Jul 2023",
    },
    {
        id: 3,
        company: "Amantya Technologies",
        jobtitle: "Full Stack Software Engineer",
        startYear: "Jan 2021",
        endYear: "Dec 2022",
    },
    {
        id: 4,
        company: "Bosler",
        jobtitle: "Frontend Web Developer",
        startYear: "May 2020",
        endYear: "Dec 2020",
    },
    {
        id: 5,
        company: "Global IT Staffing",
        jobtitle: "Node.js Back-End Developer",
        startYear: "May 2018",
        endYear: "Apr 2020",
    },
];