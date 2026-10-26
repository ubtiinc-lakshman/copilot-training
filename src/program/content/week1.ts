import type { SessionContent } from "../sessions";

// Week 1 (continued): GitHub and Vercel, Supabase. Session 1 is in ../sessions.ts.
export const WEEK1: Record<string, SessionContent> = {
  s02: {
    objective: "Put your app on GitHub, deploy it to Vercel so it has a real URL, and learn how to keep secrets out of your code.",
    before: [
      "Your app from yesterday, running with npm run dev.",
      "A GitHub account (use the one your facilitator confirmed for the training) and git installed. Check: git --version.",
      "A Vercel account (sign in with GitHub). Your facilitator will tell you which team or account to use.",
    ],
    teach: [
      {
        title: "1. Why GitHub and Vercel (2 min)",
        points: [
          "GitHub keeps every version of your code, so you can always go back. It is also how Vercel finds your app.",
          "Vercel builds and hosts your app. Every push to the main branch becomes a new live version at a public URL.",
          "That public URL is what you submit every Monday.",
        ],
      },
      {
        title: "2. The four git commands you need (4 min)",
        points: [
          "git add . stages your changes. git commit -m \"message\" saves them as a version. git push sends them to GitHub. git status tells you where you are.",
          "A commit message says what changed and why, in one line: 'Add complaint form and list'.",
          "Copilot can write the message for you: use the sparkle icon in the Source Control box. Read it before you commit.",
          "Commit small and often. A broken app is easy to fix when the last commit was ten minutes ago.",
        ],
      },
      {
        title: "3. Environment variables and secrets (5 min)",
        points: [
          "A secret is anything that gives access: database keys, API keys, passwords. It never goes in your code and never goes to GitHub.",
          "Put secrets in a file called .env.local. Next.js creates .gitignore so .env.local is not committed. Check that it is listed there.",
          "In Vercel you add the same names and values under Project Settings, Environment Variables. The deployed app reads them from there.",
          "A name that starts with NEXT_PUBLIC_ is sent to the browser. Anyone can read it. Only put things there that are safe to be public.",
          "If a secret ever reaches GitHub, treat it as stolen: rotate it (make a new one) and tell your facilitator.",
          "Use made-up data only. No real customer, employee or company data in this training.",
        ],
        example: "# .env.local (never committed)\nAPP_NAME=Complaint Log\nNEXT_PUBLIC_SITE_TITLE=Society Complaint Log",
      },
      {
        title: "4. Preview and production (2 min)",
        points: [
          "Every push to main updates the production URL. Pushes to other branches get their own preview URL.",
          "If a deploy fails, open the deployment in Vercel and read the build log. Paste the error into Chat; the answer is usually there.",
        ],
      },
    ],
    demo: [
      "In the demo project: git init is already done by create-next-app. Show git status and the .gitignore entry for .env.local.",
      "Create .env.local with APP_NAME. Show the app reading it in a server component (process.env.APP_NAME) and see the title change.",
      "Use Source Control to stage, let Copilot suggest a commit message, edit it, and commit.",
      "Create a new empty repository on GitHub (private), copy the two commands it shows for an existing repository, run them, and push.",
      "On vercel.com choose Add New, Project, import the repository, and press Deploy. Wait for the build and open the URL.",
      "Add APP_NAME in Vercel Environment Variables, redeploy, and show the live site pick it up.",
      "Break something on purpose (a typo), push, and show the failed build log and how to read it with Chat.",
    ],
    lab: {
      steps: [
        "Run git status in your project. Check that .env.local is ignored (it must not appear in the list).",
        "Create .env.local with APP_NAME=<your app name>. Show it somewhere on your page, from process.env in a server component, and check it on localhost.",
        "Commit your work with a clear message.",
        "Create a private repository on GitHub, add it as origin, and push your code.",
        "Import the repository in Vercel and deploy. Open the URL it gives you.",
        "Add APP_NAME in Vercel's Environment Variables and redeploy. Confirm the live site shows it.",
        "Write your Vercel URL at the top of NOTES.md. Push once more and check the new version goes live by itself.",
      ],
      doneWhen: [
        "Your code is on GitHub and .env.local is not in the repository.",
        "Your app is live at a vercel.app URL that you can open on your phone.",
        "The live site shows the value you set in Vercel's environment variables.",
      ],
    },
    share: "Two or three people share one problem they hit while deploying and how they fixed it. Then mark the lab complete and take the quiz.",
    homework: [
      "Keep improving your page and push each time so the live version stays current.",
      "Tomorrow (Thu Oct 29) we add a Supabase database, so create a free Supabase account and a new project (note the project URL and the anon key; the facilitator will show where).",
      "Library: Day 9 (Git workflows), Day 7 (code review basics).",
    ],
    facilitator: [
      "Account problems take the longest: GitHub sign-in with company mail, Vercel team/account choice and any approval needed to connect GitHub to Vercel. Have two helpers walk the room.",
      "Make sure nobody commits .env.local. If someone does, show how to rotate and remove it, and do not shame them.",
      "Repositories are private. The training site repo is public, so never copy the pain point text into a public repo.",
      "Confirm Vercel plan and the commercial-use terms of the free tier before Monday. This is an open item in the plan.",
    ],
  },
  s03: {
    objective: "Add a Supabase database to your app so what people enter is saved, and show it back as a list.",
    before: [
      "Your app deployed on Vercel from yesterday.",
      "A Supabase account and a new project (free tier). Keep the project URL and the anon public key at hand: Project Settings, API.",
    ],
    teach: [
      {
        title: "1. What a database gives you (2 min)",
        points: [
          "Until now your data lived in React state and vanished on refresh. A database keeps it.",
          "Supabase is a hosted Postgres database with a web dashboard. A table is like a sheet: columns are the fields, rows are the records.",
        ],
      },
      {
        title: "2. Designing a table for your pain point (4 min)",
        points: [
          "Ask: what is one record in my app? A complaint, a leave request, a booking. That is your table.",
          "Every table has an id and a created_at column. Then add one column per thing you collect, with a type: text, number, boolean, date.",
          "Start small. You can always add a column later.",
          "Ask Chat: 'Write the SQL to create a table for ... with these fields', then read it before running it.",
        ],
        example: "create table complaints (\n  id bigint generated always as identity primary key,\n  created_at timestamptz not null default now(),\n  title text not null,\n  details text,\n  status text not null default 'open'\n);",
      },
      {
        title: "3. Connecting from Next.js (5 min)",
        points: [
          "Install the client: npm install @supabase/supabase-js.",
          "Put the URL and the anon key in .env.local as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. The anon key is designed to be public, but only because of row level security (next point).",
          "Add the same two variables to Vercel and redeploy, or the live app will not connect.",
          "Create one small file that builds the client, and import it wherever you need data.",
          "Never put the service role key in the browser or in a NEXT_PUBLIC_ variable. It bypasses all protection.",
        ],
        example: "import { createClient } from '@supabase/supabase-js'\n\nexport const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!\n)",
      },
      {
        title: "4. Row level security, just enough for week 1 (3 min)",
        points: [
          "Supabase turns row level security (RLS) on for tables you create in the dashboard. With RLS on and no policy, nobody can read or write.",
          "For week 1 (no login) you add one policy that lets anyone read and add rows. This is fine for a practice app with made-up data.",
          "In week 2 we replace it with policies that tie each row to a signed-in user. Do not put real data in this version.",
        ],
        example: "alter table complaints enable row level security;\ncreate policy \"anyone can read\" on complaints for select using (true);\ncreate policy \"anyone can add\" on complaints for insert with check (true);",
      },
    ],
    demo: [
      "Open the Supabase dashboard, SQL Editor. Ask Chat for the table SQL for the complaint log, review it, paste it, run it. Show the table in Table Editor.",
      "Run the RLS policy SQL and explain each of the three lines.",
      "npm install @supabase/supabase-js. Create the client file and the two variables in .env.local.",
      "Ask Chat (with page.tsx as context): 'Load complaints from Supabase and show them. The form should insert a row, then reload the list.' Review the diff.",
      "Add a complaint in the browser, refresh, and show it is still there. Open Table Editor to see the row.",
      "Add the two variables in Vercel, redeploy, and show it working on the live URL.",
      "Show an error on purpose (wrong key) and read the message in the browser console.",
    ],
    lab: {
      steps: [
        "Decide your table: the name, and one column per field in 'Your app must'. Write it down, then ask Chat to produce the SQL and read it.",
        "Run the SQL in Supabase and add the RLS policies for read and insert.",
        "Install @supabase/supabase-js, add the URL and anon key to .env.local, and create the client file.",
        "Change your page so the form inserts a row and the list is loaded from the table.",
        "Test: add two records, refresh, and confirm they are still there. Fix errors by pasting them into Chat.",
        "Add the two variables to Vercel, push your code, and test on your live URL.",
        "Commit with a clear message. Note in NOTES.md any prompt that worked well.",
      ],
      doneWhen: [
        "Records added on your live URL are still there after a refresh.",
        "No Supabase key is in your code or on GitHub; only in .env.local and Vercel.",
        "Your page covers each item in 'Your app must' except edit and delete, which you finish on Friday.",
      ],
    },
    share: "Two or three people show their table design and say what they would change. Then mark the lab complete and take the quiz.",
    homework: [
      "Friday (Oct 30) is the online call to finish, edit, delete and harden. Come with a list of what is still missing from 'Your app must'.",
      "Monday (Nov 2) you submit the live URL, the biggest challenge and how you solved it.",
      "Library: Day 26 (SQL and databases with Copilot).",
    ],
    facilitator: [
      "The commonest failure is forgetting the RLS policy (the list is empty and no error shows) or forgetting the Vercel variables (works locally, fails live).",
      "Confirm the Supabase organisation, project limits (free projects pause when idle) and the data-residency or approval question before the weekly apps run. These are open items in the plan.",
      "Remind everyone again: made-up data only, and the service role key never leaves Supabase's dashboard.",
      "Anyone behind: let them copy the table SQL from a peer; the learning is in connecting and reviewing, not in typing SQL.",
    ],
  },
};
