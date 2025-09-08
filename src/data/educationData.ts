// data/educationData.ts
export type EducationItem = {
  id: number;
  institution: string;
  course: string;
  startYear: string;
  endYear: string;
};

export const educationData: EducationItem[] = [
  {
    id: 1,
    institution: "Florida State University",
    course: "Master of Science in Computer Science",
    startYear: "2023",
    endYear: "2025",
  },
  {
    id: 2,
    institution: "Univesity of Delhi",
    course: "Bachelor of Science in Computer Science",
    startYear: "2017",
    endYear: "2020",
  },
];