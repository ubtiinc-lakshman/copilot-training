// Teaching content for each in-person session, shown on /sessions/<id>. Session shape (60 min): teach 15, demo 10, lab 25, quiz 5, share 5.
// Quiz questions are not here: they live in Neon (quiz day = 100 + session number), see data/quizzes.json.
import { WEEK1 } from "./content/week1";
import { WEEK2 } from "./content/week2";
import { WEEK3 } from "./content/week3";
import { WEEK4 } from "./content/week4";
import { WEEK5 } from "./content/week5";

export type SessionContent = {
  objective: string;
  before: string[]; // bring or have ready
  teach: { title: string; points: string[]; example?: string }[];
  demo: string[];
  lab: { steps: string[]; doneWhen: string[] };
  share: string;
  homework: string[];
  facilitator: string[];
};

const SESSION_ONE: Record<string, SessionContent> = {
  s01: {
    objective: "Use Copilot as a builder: turn your pain point into a clear prompt, choose the right Copilot mode and model, and scaffold a running Next.js app by the end of the hour.",
    before: [
      "Your pain point (get it on My week, first thing).",
      "VS Code with GitHub Copilot and Copilot Chat installed and signed in. Check: open Chat and ask it anything.",
      "Node.js 22 or newer. Check: run node -v in a terminal.",
      "An empty folder for your app, for example copilot-app-1.",
    ],
    teach: [
      {
        title: "1. Read your pain point like a client brief (3 min)",
        points: [
          "Your pain point is a real person's problem, not a feature list. Say it back in one sentence: who has the problem, what hurts, and what a good outcome looks like.",
          "The 'Your app must' list is your definition of done. Copy it somewhere you can see it.",
          "Week 1 rule: one page, saved data, no login. Keep it small enough to finish by Friday.",
        ],
      },
      {
        title: "2. A prompt that works: Goal, Context, Constraints, Output (5 min)",
        points: [
          "Goal: what you want built or changed, in one sentence.",
          "Context: the stack and what already exists (Next.js, TypeScript, Tailwind, this file).",
          "Constraints: what must and must not happen (no login, no real data, keep it simple).",
          "Output: how you want the answer (a short plan first, then the code, one file at a time).",
          "Small asks beat big asks. Ask for a plan, review it, then ask for the code.",
        ],
        example:
          "Goal: Plan a small web app for my society's complaint log.\nContext: Next.js (App Router), TypeScript, Tailwind. Data will be saved in a database later.\nConstraints: one page, no login, a form to add a complaint and a list to view them, mark one as resolved.\nOutput: first list the pages, components and the data each complaint needs. Do not write code yet.",
      },
      {
        title: "3. Inline suggestions, Chat, and which to use (3 min)",
        points: [
          "Inline suggestions: you type, Copilot completes. Best for small, obvious code once you know what you are writing. Press Tab to accept, Esc to reject.",
          "Chat: you ask, Copilot answers or edits. Best for planning, explaining an error, and making a change across a file. Use the Ask / Edit options in the Chat panel.",
          "Agent mode makes changes across many files by itself. We cover it on Tue Nov 10. Until then, stay with Chat and inline so you read everything.",
          "Add files as context with the paperclip or #file so Chat sees what you mean.",
        ],
      },
      {
        title: "4. Choosing a model, and what costs credits (2 min)",
        points: [
          "The model picker is at the bottom of the Chat panel. Use the default for everyday coding and questions.",
          "Pick a stronger, slower model for planning and hard debugging only. Heavier models and longer agent runs use more of your allowance.",
          "Credits: your allowance is being set up by the admin. Until it is confirmed, be economical: one clear prompt, not ten vague ones.",
          "Never paste real customer data, passwords or keys into a prompt. Use made-up data.",
        ],
      },
      {
        title: "5. Always review what Copilot gives you (2 min)",
        points: [
          "Copilot is fast, not correct by default. Read every change. If you cannot explain a line, ask Chat to explain it, or remove it.",
          "Run the app after every change. A working screen is the real test.",
          "Keep a note of the prompts that worked. You will need them for the Monday submission ('How you used Copilot').",
        ],
      },
    ],
    demo: [
      "Facilitator takes the demo pain point 'Society complaint log' and reads it aloud.",
      "Open Chat. Write the Goal / Context / Constraints / Output prompt live (use the example above). Show the plan that comes back and point out one thing to change.",
      "Refine once: 'Use a single page. Store complaints in a list for now.' Show how a short follow-up beats starting over.",
      "In a terminal: npx create-next-app@latest complaint-log (TypeScript yes, Tailwind yes, ESLint yes, App Router yes, src directory yes). Open the folder in VS Code.",
      "Run npm run dev, open http://localhost:3000, show the default page.",
      "Ask Chat (with app/page.tsx added as context): 'Replace this page with a form to add a complaint and a list of complaints, kept in React state for now.' Review the change, run it, add two complaints.",
      "Show an inline suggestion: start typing a function name and accept with Tab. Then reject a bad one with Esc to show that reviewing is the job.",
    ],
    lab: {
      steps: [
        "Open My week and read your pain point. Write the one-sentence version in a file called NOTES.md in your project folder.",
        "In Chat, write your own Goal / Context / Constraints / Output prompt for your app. Ask for a plan only: pages, components and the data it needs. Do not accept it blindly; change at least one thing.",
        "Create the app: npx create-next-app@latest copilot-app-1 (TypeScript, Tailwind, ESLint, App Router, src directory).",
        "Run npm run dev and open the default page in your browser.",
        "Using Chat with app/page.tsx as context, build the first version of your single page from your plan. Data can sit in React state for now; we save it properly on Thursday.",
        "Add one item to your list to prove it works. Fix anything that breaks by pasting the error into Chat.",
        "Add your best prompts to NOTES.md (these go into your Monday submission).",
      ],
      doneWhen: [
        "The app runs on localhost with no errors in the terminal.",
        "Your page shows a form and a list that matches your pain point.",
        "NOTES.md has your pain point sentence and at least two prompts you used.",
      ],
    },
    share:
      "Two or three people share one prompt that worked and one thing Copilot got wrong. Then everyone clicks 'I completed this lab' on My week and takes the 5-question quiz.",
    homework: [
      "Keep building your page until it covers every item in 'Your app must'.",
      "Tomorrow (Wed Oct 28) we put it on GitHub and Vercel, so make sure it still runs with npm run dev.",
      "Library, if you want more: Day 5 (prompt engineering), Day 3 (inline suggestions), Day 4 (Copilot Chat).",
    ],
    facilitator: [
      "Pain point goes out at the start. If someone has not got one, check the bank has rows (seed) and that they are on My week, not the library.",
      "Typical blockers: Node older than 22, Copilot not signed in, corporate proxy blocking npx. Have a colleague pair up rather than debug alone.",
      "Do not let anyone start Supabase or login yet. Week 1 is one page, saved data, no login, and the saving comes on Thursday.",
      "Credits are not yet allocated. If people hit limits, tell them to switch to the default model and write shorter prompts.",
    ],
  },
};

export const SESSIONS: Record<string, SessionContent> = { ...SESSION_ONE, ...WEEK1, ...WEEK2, ...WEEK3, ...WEEK4, ...WEEK5 };

export const getSession = (id: string) => SESSIONS[id];
