// data/experienceData.ts
export type ExperienceItem = {
    id: number;
    company: string;
    jobtitle: string;
    startYear: string;
    endYear: string;
    href?: string;
    summary: string;
    skills: string[];
};

export const experienceData: ExperienceItem[] = [
    {
        id: 1,
        company: "BigCommerce",
        jobtitle: "AWS Integration Engineer",
        startYear: "May 2024",
        endYear: "Dec 2024",
        href: "#",
        summary:
            "Led end-to-end integrations between Salesforce and internal platforms. Built a daily ETL for ~150k records that cut refresh time ~70% and stabilized retries. Delivered bidirectional instance sync to keep data in parity across environments, with guardrails for schema drift and backfills. Added dashboards, alarms, and runbooks so ops could self-serve. Partnered with CRM and security to productionize access, secrets, and audit trails.",
        skills: [
            "AWS Lambda",
            "API Gateway",
            "Step Functions",
            "S3",
            "EventBridge",
            "AppFlow",
            "CloudWatch",
            "AWS CDK",
            "Python",
            "Salesforce (Flows, Apex)",
        ],
    },
    {
        id: 2,
        company: "Dell Technologies",
        jobtitle: "Software Engineer",
        startYear: "Jan 2023",
        endYear: "Jul 2023",
        href: "#",
        summary:
            "Shipped customer-facing microfrontend components that boosted feature engagement ~40%. Took on RCA for 10+ issues and closed fixes within the sprint, improving stability and cutting regressions with a focused test strategy.",
        skills: [
            "React",
            "Redux",
            "JavaScript",
            "Web Components",
            "Webpack",
            "jQuery",
            "Jest",
            "Chrome DevTools",
            "Microfrontends",
        ],
    },
    {
        id: 3,
        company: "Amantya Technologies",
        jobtitle: "Full-stack Software Engineer",
        startYear: "Jan 2021",
        endYear: "Dec 2022",
        href: "#",
        summary:
            "Delivered data-intensive applications processing telecom tower signals and alerts. Reworked slow endpoints and background jobs, reducing p95 response times ~60% and lowering integration latency ~40% via event-driven flows. Tuned queries and indexes for measurable DB gains (~30%). Drove auth hardening and service boundaries to keep multi-tenant workloads predictable at scale.",
        skills: [
            "React",
            "TypeScript",
            "Python",
            "Django",
            "PostgreSQL",
            "MongoDB",
            "Microservices",
            "REST/SOAP",
            "OAuth 2.0",
            "AWS (Lambda, API Gateway, Step Functions)",
        ],
    },
    {
        id: 4,
        company: "Bosler",
        jobtitle: "Front-End Software Engineer",
        startYear: "May 2020",
        endYear: "Dec 2020",
        href: "#",
        summary:
            "Built data-heavy visualizations for millions of points and incorporated accessibility feedback, improving usability ~15% for key workflows.",
        skills: ["React", "Redux", "JavaScript", "Three.js", "D3", "Accessibility"],
    },
    {
        id: 5,
        company: "Global IT Staffing (GITS)",
        jobtitle: "Node.js Back-End Developer",
        startYear: "May 2018",
        endYear: "Apr 2020",
        href: "#",
        summary:
            "Owned high-throughput APIs with a robust auth model and a test suite reaching ~95% coverage, cutting bug rates and keeping releases steady.",
        skills: ["Node.js", "Express", "Fastify", "REST APIs", "Passport.js", "JWT", "Jest", "Mocha"],
    },
];