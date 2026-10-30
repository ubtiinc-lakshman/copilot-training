// The courses in the IC Training Center. Add a course here and give it a page under src/app/courses/<id>/.
export type Course = { id: string; title: string; blurb: string; href: string; status: "live" | "soon"; parts: string[] };

export const COURSES: Course[] = [
  {
    id: "copilot",
    title: "GitHub Copilot",
    blurb: "Eight common days for every team, a self-paced weekly app build, and a 30-lesson library with labs and quizzes.",
    href: "/courses/copilot",
    status: "live",
    parts: ["Content", "Labs", "Tasks", "Quizzes", "Gate assessment"],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    blurb: "Self-paced in three levels: the prompt formula and safe use, a track for your own team, then an assessment on a real scenario.",
    href: "/courses/prompt-engineering",
    status: "live",
    parts: ["Content", "Labs", "Quizzes", "Assessment"],
  },
];
