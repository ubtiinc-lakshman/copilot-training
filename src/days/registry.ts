// One entry per training day. Add a day's showcase in src/days/day-NN/ and register it in showcases.tsx.
export type Level = "Basic" | "Intermediate" | "Advanced";

export interface Day {
  day: number;
  level: Level;
  title: string;
  date: string; // ISO yyyy-mm-dd
}

const TITLES: [Level, string][] = [
  ["Basic", "Intro to GitHub Copilot & AI Pair Programming"],
  ["Basic", "Environment Setup & Licensing Across IDEs"],
  ["Basic", "Inline Suggestions & Code Completion"],
  ["Basic", "Copilot Chat Basics (Ask / Explain / Fix)"],
  ["Basic", "Prompt Writing Fundamentals"],
  ["Basic", "Copilot for Docs & Code/Test Comments"],
  ["Basic", "Copilot for Non-Code Artifacts"],
  ["Basic", "Working Across Languages & Stacks"],
  ["Basic", "Ethics, Licensing & Security Basics"],
  ["Basic", "Basic Capstone (Level Gate)"],
  ["Intermediate", "Advanced Prompt Engineering (Chained Prompts)"],
  ["Intermediate", "Copilot Chat for Debugging, Code Review & Defect Triage"],
  ["Intermediate", "Test Generation with Copilot (core QA day)"],
  ["Intermediate", "Multi-File / Workspace-Aware Context"],
  ["Intermediate", "Refactoring Legacy Code & Stabilizing Flaky Test Suites"],
  ["Intermediate", "Copilot in PR & Code-Review Workflows"],
  ["Intermediate", "IDE Customization, Extensions & Keybindings"],
  ["Intermediate", "Copilot for APIs & Integration Work / API Test Scripting (core QA day)"],
  ["Intermediate", "Copilot on Shared/Cross-Team Codebases"],
  ["Intermediate", "Intermediate Capstone (Level Gate)"],
  ["Advanced", "Copilot Agent Mode: End-to-End Features & Test Frameworks"],
  ["Advanced", "Custom Instructions & Repo-Level Context Tuning"],
  ["Advanced", "Architecture & Test-Strategy Design"],
  ["Advanced", "Security Review of AI-Generated Code"],
  ["Advanced", "Performance Optimization & Performance/Load Test Scripting"],
  ["Advanced", "Copilot for Data Workflows & Test Data Generation"],
  ["Advanced", "Building Team Prompt Libraries & Playbooks"],
  ["Advanced", "Governance, Compliance & Adoption Metrics"],
  ["Advanced", "Train-the-Trainer: Coaching Others"],
  ["Advanced", "Advanced Capstone (Level Gate, Program Certification)"],
];

// 30 consecutive weekdays from Wed Oct 21, 2026 (no fixed holidays in the window).
function sessionDates(): string[] {
  const out: string[] = [];
  const d = new Date(Date.UTC(2026, 9, 21));
  while (out.length < TITLES.length) {
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

const DATES = sessionDates();

export const DAYS: Day[] = TITLES.map(([level, title], i) => ({
  day: i + 1,
  level,
  title,
  date: DATES[i],
}));

export const LEVELS: Level[] = ["Basic", "Intermediate", "Advanced"];

export function getDay(n: number): Day | undefined {
  return DAYS.find((d) => d.day === n);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
