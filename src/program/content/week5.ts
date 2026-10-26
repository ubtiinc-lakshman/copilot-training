import type { SessionContent } from "../sessions";

// Week 5: dashboards and an AI feature, security review, performance and polish.
export const WEEK5: Record<string, SessionContent> = {
  s13: {
    objective: "Turn the data in your app into a dashboard with a chart, and optionally add a small AI feature, such as a summary.",
    before: ["Your new week 5 pain point.", "Some made-up data in your tables, or a sample CSV, so the charts have something to show."],
    teach: [
      {
        title: "1. From rows to answers (3 min)",
        points: [
          "A dashboard answers a question at a glance: how many, how much, over time, by category.",
          "Start from the question your pain point's owner would ask, then work out which numbers answer it.",
          "Three charts are enough: a number card (total), a bar chart (by category), a line (over time).",
        ],
      },
      {
        title: "2. Compute on the server, draw on the client (4 min)",
        points: [
          "Let the database count and sum for you: a SQL query or a Supabase select with a group. Do not download every row and add them up in the browser.",
          "Use a small chart library, such as Recharts, in a client component. Ask Chat for a bar chart from an array of { label, value }.",
          "Handle the empty case: no data should say so, not show a broken chart.",
          "Put the chart in a card with a title that says what it shows and its unit.",
        ],
        example: "select status, count(*) as total\nfrom complaints\ngroup by status\norder by total desc;",
      },
      {
        title: "3. Upload a CSV (3 min)",
        points: [
          "If your pain point starts from a file, accept a CSV upload, parse it, validate every row, and show a preview before saving.",
          "Reject files that are too big or have the wrong columns, with a message that says which.",
        ],
      },
      {
        title: "4. An optional AI feature (5 min)",
        points: [
          "Good small uses: summarise a list of comments, suggest a category, draft a reply.",
          "Call the model from a server route, with the key in an environment variable. Never from the browser.",
          "Send as little data as possible, and only made-up data in this training. Tell users when text is AI-generated.",
          "An AI answer can be wrong. Show it as a suggestion the user can edit.",
          "Ask your facilitator which provider and key are approved. Do not sign up with a personal card.",
        ],
      },
    ],
    demo: [
      "Demo pain point: a CSV dashboard for monthly sales.",
      "Upload a small CSV, show validation of columns and a preview.",
      "Save the rows, then show a SQL query grouped by month and ask Chat for a bar chart component with Recharts. Review the code.",
      "Show the empty state and the number cards.",
      "Add an AI summary button on a server route with the approved provider. Show the answer labelled as AI-generated.",
    ],
    lab: {
      steps: [
        "Write down the three questions your pain point's owner would ask of the data.",
        "Create the app (copilot-app-5), connect Supabase, and add made-up data.",
        "Write the queries that answer those questions and show the numbers on a page.",
        "Add at least one chart with a title, labels and an empty state.",
        "If your pain point suits it, add the AI feature or a CSV upload with validation.",
        "Test with no data, a little data and lots of data.",
        "Push, deploy, and test on the live URL.",
      ],
      doneWhen: ["The dashboard shows at least one chart from real rows in your database.", "It handles the empty case.", "If you added AI, the key is only on the server and the output is labelled."],
    },
    share: "Two or three people show their dashboard and the question it answers. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow we review security; start a list of every place your app takes input or shows data.", "Library: Day 26 (SQL), Day 25 (performance)."],
    facilitator: [
      "AI provider access and cost are open items. If there is no approved key, the AI part is optional; the dashboard satisfies the week's feature.",
      "Check that nobody sends real data to an AI service.",
    ],
  },
  s14: {
    objective: "Review your own app for security problems and fix them: secrets, input validation and row level security.",
    before: ["Your app 5 on GitHub and Vercel.", "Two test accounts in your app."],
    teach: [
      {
        title: "1. Think like a careless user and a bad one (3 min)",
        points: [
          "Careless: empty fields, huge text, wrong types, double clicks. Bad: someone who changes a URL, edits a request, or tries another user's id.",
          "You are looking for the places where your app trusts something it should not.",
        ],
      },
      {
        title: "2. The checklist (6 min)",
        points: [
          "Secrets: nothing in code or git history; .env.local ignored; no service role key in NEXT_PUBLIC_ variables; keys in Vercel only.",
          "Input: every route handler and form validates type, length and format on the server.",
          "Row level security: on for every table; policies tie rows to auth.uid(); no 'using (true)' on private data.",
          "Storage: private buckets, policies by user folder, type and size limits.",
          "Pages: signed-out users are redirected; admin-only pages check a role on the server.",
          "Errors: users see a friendly message; details and stack traces stay in logs.",
          "Dependencies: remove what you do not use; run npm audit and read the high severity results.",
        ],
      },
      {
        title: "3. Test it like an attacker (4 min)",
        points: [
          "With two accounts, try to read and change the other's rows by id in a URL and in the browser network tab.",
          "Send bad input to your routes (a tool like curl or the browser console): missing fields, strings where numbers are expected, very long text.",
          "Search the repository for 'key', 'secret', 'password', 'token' and check each hit.",
        ],
      },
      {
        title: "4. Using Copilot for a security pass (2 min)",
        points: [
          "Ask Chat to review a route handler for security problems and to list them by severity. Verify each claim before changing code.",
          "It can miss problems and can also invent them. It supports your review, it does not replace it.",
        ],
        example: "Review app/api/book/route.ts for security problems: input validation, authorisation, secret handling and error leaks.\nList each finding with severity and the smallest fix. Do not change any code yet.",
      },
    ],
    demo: [
      "Run the checklist on the demo app aloud, item by item.",
      "Find a planted problem: one table without a user policy. Show user B reading user A's rows by changing an id.",
      "Fix with a policy and re-run the test to prove it.",
      "Search the repo for 'key' and show how a leaked value would look in git history.",
      "Ask Chat for a security review of one route; verify two of its findings, discard one that is wrong.",
    ],
    lab: {
      steps: [
        "Copy the checklist into NOTES.md and go through your app item by item. Mark each pass, fail or not applicable.",
        "Run the two-account test on every page and route that returns data.",
        "Send bad input to each route handler and check the response.",
        "Search the repo and the Vercel variables for secrets in the wrong place.",
        "Fix each failing item. Re-test every fix.",
        "Run npm audit and handle high severity results where you can.",
        "Write the final checklist state in NOTES.md and commit it.",
      ],
      doneWhen: ["The checklist in NOTES.md is complete with no unfixed failures.", "Two accounts cannot see each other's data.", "No secret is in the code or in a NEXT_PUBLIC_ variable."],
    },
    share: "Two or three people describe one problem they found in their own app. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow is performance and polish; note which page of your app feels slowest.", "Library: Day 24 (security basics)."],
    facilitator: [
      "This is the security gate for the final app. Check a few apps for leaked keys in the repository; rotate and fix with the owner.",
      "Raise any pattern you see across the room (for example, everyone forgetting storage policies).",
      "If a participant finds a real vulnerability in a shared service rather than their app, take it to the security contact, not the group.",
    ],
  },
  s15: {
    objective: "Measure how fast your app is, find the slowest page, fix one thing, and polish what users see.",
    before: ["Your app 5 deployed and with enough data to feel real (a few dozen rows)."],
    teach: [
      {
        title: "1. Measure first (4 min)",
        points: [
          "Never guess what is slow. Measure, change one thing, measure again.",
          "Lighthouse in Chrome DevTools gives a score and a list of problems. Use the mobile setting on your live URL.",
          "The Network tab shows what loads and how long each request takes. Sort by time.",
        ],
      },
      {
        title: "2. The usual suspects (5 min)",
        points: [
          "Too much data: fetching every row, or every column. Ask for only what the page shows; add paging or a limit.",
          "Slow queries: a filter on a column that is not indexed. An index helps lookups on that column (create index on complaints (status);).",
          "Many requests one after another instead of together. Run independent fetches at the same time.",
          "Large images. Use the Next.js Image component and sensible sizes.",
          "Too much JavaScript in the browser. Keep components on the server unless they need to be interactive.",
        ],
        example: "create index complaints_status_idx on complaints (status);",
      },
      {
        title: "3. Polish (3 min)",
        points: [
          "Empty states, loading states and clear error messages. A blank screen looks broken.",
          "Works on a phone: test at a narrow width.",
          "Page titles, readable contrast, labels on every form field, and the keyboard can reach every control.",
          "Remove console logs, dead code and unused files.",
        ],
      },
      {
        title: "4. Using Copilot for it (3 min)",
        points: [
          "Paste the Lighthouse findings or a slow query into Chat and ask for the likely cause and the smallest fix.",
          "Check that the fix actually improved the number you measured. If it did not, revert it.",
        ],
      },
    ],
    demo: [
      "Run Lighthouse on the demo app's live URL and note the score and the top finding.",
      "Open the Network tab, find the slowest request, and trace it to the query.",
      "Add the limit and the index, redeploy, and measure again.",
      "Show an empty state, a loading state and a narrow-width view.",
      "Remove a console log and an unused file with Chat's help.",
    ],
    lab: {
      steps: [
        "Run Lighthouse (mobile) on your live URL. Write the scores in NOTES.md as 'before'.",
        "Find the slowest page or request in the Network tab.",
        "Choose one fix: limit rows, add an index, fetch in parallel, or resize an image. Apply it.",
        "Redeploy and measure again. Write the 'after' numbers.",
        "Add or fix one empty state, loading state or error message.",
        "Test at phone width and with the keyboard only.",
        "Remove dead code, commit, and push.",
      ],
      doneWhen: ["NOTES.md has before and after numbers for one fix.", "Your app has sensible empty and error states.", "It is usable on a phone."],
    },
    share: "Two or three people share their biggest improvement with the before and after numbers. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow is the Friday call (Nov 27): final polish and deployment.", "Prepare a two-minute story for the finale: the problem, what you built, one challenge, one thing you learned."],
    facilitator: [
      "Lighthouse scores vary run to run; look at the trend, not exact numbers.",
      "Free-tier cold starts can make the first request slow; run the test twice.",
      "Start collecting the final checks for certification: attendance, four of five apps passing, quiz average.",
    ],
  },
};
