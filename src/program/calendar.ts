// The weekly app-build program (see docs/APP-BUILD-PLAN.md). One week = one app, Monday to Monday.
// Source of truth for "today's activities", lab completion and submissions.
export type EventKind = "session" | "call" | "submit" | "finale";

export type ProgramEvent = {
  id: string; // also the activity id stored in `completions` (submit events use the submissions table instead)
  date: string; // ISO date, India time
  week: number;
  kind: EventKind;
  title: string;
  skill?: string; // what is taught (sessions)
  lab?: string; // what to do (sessions, calls)
};

export type Week = { week: number; assignOpens: string; due: string; feature: string };

// A new pain point is assigned from `assignOpens` (the Monday call, or the first session for week 1); the app is due on `due`.
export const WEEKS: Week[] = [
  { week: 1, assignOpens: "2026-10-27", due: "2026-11-02", feature: "A single page with saved data, no login" },
  { week: 2, assignOpens: "2026-11-02", due: "2026-11-09", feature: "Login, and each person sees their own data" },
  { week: 3, assignOpens: "2026-11-09", due: "2026-11-16", feature: "File or image upload with validation" },
  { week: 4, assignOpens: "2026-11-16", due: "2026-11-23", feature: "An email, a webhook or a scheduled job" },
  { week: 5, assignOpens: "2026-11-23", due: "2026-11-30", feature: "A dashboard or an AI feature, security-reviewed" },
];

const s = (n: number, date: string, week: number, title: string, skill: string, lab: string): ProgramEvent => ({
  id: `s${String(n).padStart(2, "0")}`, date, week, kind: "session", title, skill, lab,
});
const call = (week: number, date: string, app: string): ProgramEvent => ({
  id: `w${week}-call`, date, week, kind: "call", title: `Friday call: finish and deploy app ${app}`,
  lab: "Finish your app, deploy it to Vercel, harden it, and ask for help on anything blocking you.",
});
const submit = (week: number, date: string): ProgramEvent => ({
  id: `w${week}-submit`, date, week, kind: "submit", title: `Monday call: submit app ${week}`,
});

export const EVENTS: ProgramEvent[] = [
  s(1, "2026-10-27", 1, "Copilot as a builder", "Prompt template, inline and Chat, choosing a model, what uses credits. Scaffold a Next.js app.", "Scaffold your app from your pain point."),
  s(2, "2026-10-28", 1, "GitHub and Vercel", "Repo, commits, deploy, environment variables, secrets, no real data.", "Push to GitHub, deploy to Vercel, set an environment variable safely."),
  s(3, "2026-10-29", 1, "Supabase", "Tables, saving data, connecting from Next.js.", "Add a table and a list that saves."),
  call(1, "2026-10-30", "1"),
  submit(1, "2026-11-02"),
  s(4, "2026-11-03", 2, "Supabase Auth", "Login and per-user data.", "Scaffold app 2 and add login."),
  s(5, "2026-11-04", 2, "Debugging with Copilot", "Chat /fix, browser console, Vercel logs.", "Find and fix a real failure in app 2."),
  s(6, "2026-11-05", 2, "Tests with Copilot", "Generate tests, check negative and edge cases.", "Write tests for app 2's main flow."),
  call(2, "2026-11-06", "2"),
  submit(2, "2026-11-09"),
  s(7, "2026-11-10", 3, "Agent mode", "Supervise an agent through a feature; it uses the most credits.", "Scaffold app 3, add a feature with an agent, review every file."),
  s(8, "2026-11-11", 3, "Connectors (MCP)", "GitHub, Supabase, Vercel and browser-testing connectors: what they are, how to add them, safety.", "Connect one and use it on app 3."),
  s(9, "2026-11-12", 3, "File storage and validation", "Upload, store and validate files.", "Upload and validate a file in app 3."),
  call(3, "2026-11-13", "3"),
  submit(3, "2026-11-16"),
  s(10, "2026-11-17", 4, "Integrations", "API routes, webhooks, email, scheduled jobs.", "Scaffold app 4, send an email or run a scheduled job."),
  s(11, "2026-11-18", 4, "Custom instructions", "`.github/copilot-instructions.md` and reusing prompts.", "Write the instructions file for app 4."),
  s(12, "2026-11-19", 4, "PRs, review and refactoring", "Pull requests, Copilot code review, refactoring safely.", "Open a PR on app 4 and respond to the review comments."),
  call(4, "2026-11-20", "4"),
  submit(4, "2026-11-23"),
  s(13, "2026-11-24", 5, "Dashboards and an AI feature", "Charts from your data; optionally an AI summary.", "Scaffold app 5, add a chart or a summary."),
  s(14, "2026-11-25", 5, "Security review of your app", "Secrets, input validation, row-level security.", "Run the security checklist against app 5."),
  s(15, "2026-11-26", 5, "Performance and polish", "Measure, find the slow page, fix it.", "Measure and fix one slow page in app 5."),
  call(5, "2026-11-27", "5"),
  submit(5, "2026-11-30"),
  { id: "finale", date: "2026-12-01", week: 5, kind: "finale", title: "Finale: showcase and certification", lab: "Show your work, share what you learned." },
];

export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);
export const eventsOn = (date: string) => EVENTS.filter((e) => e.date === date);
export const getWeek = (week: number) => WEEKS.find((w) => w.week === week);

// The week whose pain point is current on `date`; 0 before the first one opens.
export const currentWeek = (date: string) => WEEKS.filter((w) => date >= w.assignOpens).at(-1)?.week ?? 0;

export const nextEvent = (date: string) => EVENTS.find((e) => e.date >= date);

// Events a participant marks done (labs, calls, finale). Submissions have their own form.
export const trackedEvents = EVENTS.filter((e) => e.kind !== "submit");

// Library lessons (the 30-day content, by day number) that match each session, for "go deeper" links.
const LIBRARY: Record<string, number[]> = {
  s01: [5, 3, 4], s02: [9, 7], s03: [26], s04: [24, 9], s05: [12, 4], s06: [13], s07: [21], s08: [14, 22],
  s09: [18], s10: [18], s11: [22, 27], s12: [15, 16], s13: [26], s14: [24, 9], s15: [25], finale: [28, 29],
};
export const libraryFor = (id: string): number[] => LIBRARY[id] ?? [];
