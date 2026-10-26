import type { SessionContent } from "../sessions";

// Week 2: login and per-user data, debugging, tests.
export const WEEK2: Record<string, SessionContent> = {
  s04: {
    objective: "Add Supabase Auth so people sign up and log in, and make sure each person sees only their own data.",
    before: [
      "Your new pain point for week 2 (assigned on Monday).",
      "Node 22+, VS Code with Copilot, and your Supabase and Vercel accounts from last week.",
    ],
    teach: [
      {
        title: "1. Authentication and authorisation (3 min)",
        points: [
          "Authentication: who are you? (login). Authorisation: what may you see and do? (rules).",
          "Week 2 needs both: a login, and rules so a user sees only their rows.",
        ],
      },
      {
        title: "2. Supabase Auth with email and password (5 min)",
        points: [
          "In the dashboard, Authentication, Providers: email and password is on by default. For practice, turn off 'Confirm email' so you can test without waiting for mail. Turn it back on for anything real.",
          "Sign up: supabase.auth.signUp({ email, password }). Log in: supabase.auth.signInWithPassword(...). Log out: supabase.auth.signOut().",
          "For Next.js server-side sessions use the @supabase/ssr package. Ask Chat: 'Set up Supabase Auth with @supabase/ssr in the Next.js App Router', then follow the current Supabase docs for the exact files.",
          "Passwords are handled by Supabase. You never store or log them.",
        ],
        example: "const { error } = await supabase.auth.signInWithPassword({ email, password })\nif (error) setMessage(error.message)",
      },
      {
        title: "3. Tie every row to a user (4 min)",
        points: [
          "Add a user_id uuid column that references auth.users, with a default of auth.uid() so it is filled automatically.",
          "Replace the 'anyone' policies from last week with ones that compare user_id to auth.uid().",
          "Test with two accounts: A must not see B's rows. This is the single most important test of the week.",
        ],
        example: "alter table leaves add column user_id uuid not null default auth.uid() references auth.users(id);\n\ndrop policy if exists \"anyone can read\" on leaves;\ndrop policy if exists \"anyone can add\" on leaves;\n\ncreate policy \"own rows: read\" on leaves for select using (user_id = auth.uid());\ncreate policy \"own rows: add\" on leaves for insert with check (user_id = auth.uid());",
      },
      {
        title: "4. Protecting pages (3 min)",
        points: [
          "A page that needs login should redirect to the login page when there is no user.",
          "Hiding a button is not security. The database policy is what really protects the data; the redirect is only a convenience.",
        ],
      },
    ],
    demo: [
      "Start the week 2 demo pain point 'Leave tracker'. Scaffold with create-next-app, add Supabase packages and environment variables as in week 1.",
      "Create the table with a user_id column and the policies shown above.",
      "Ask Chat for the signup / login / logout page and the server helper for a signed-in user. Review and run.",
      "Sign up as user A, add a leave request. Sign out. Sign up as user B and show B cannot see A's request.",
      "Add the redirect: signed-out users go to /login.",
      "Show what happens when a policy is wrong: temporarily remove the user_id check, see both users' rows, then restore it.",
    ],
    lab: {
      steps: [
        "Read your week 2 pain point. List the table(s) and which columns belong to a user.",
        "Create your new Next.js app (copilot-app-2), install Supabase, add environment variables locally and in Vercel.",
        "Create your table with a user_id column and the read and insert policies from the teach section.",
        "Build login, signup and logout using Chat. Review every file it creates.",
        "Make the main page show only the signed-in user's rows, and redirect signed-out visitors to login.",
        "Test with two accounts. Write the result in NOTES.md ('A cannot see B: yes/no').",
        "Push to a new GitHub repo, deploy to Vercel, and test login on the live URL.",
      ],
      doneWhen: [
        "You can sign up, log in and log out on your live URL.",
        "Two different accounts see different data.",
        "No keys are in the code or on GitHub.",
      ],
    },
    share: "Two or three people say how they proved user A cannot see user B's data. Then mark the lab complete and take the quiz.",
    homework: [
      "Add update and delete for the user's own rows, with matching policies.",
      "Library: Day 24 (security basics), Day 9 (Git workflows).",
    ],
    facilitator: [
      "Auth setup is the heaviest lab so far. Pair strong and slower participants.",
      "Check that nobody keeps the 'anyone can read' policy after adding user_id; that leaves the data public.",
      "Stay with email and password for training. Microsoft/SSO login is out of scope.",
      "Redirect URLs: if people try magic links or social login, the Supabase Site URL and redirect list must include the Vercel URL. Not needed for email and password.",
    ],
  },
  s05: {
    objective: "Find and fix real failures quickly, using Chat, the browser console, the terminal and Vercel's logs.",
    before: ["Your week 2 app running locally and deployed.", "Browser developer tools: press F12 and find the Console and Network tabs."],
    teach: [
      {
        title: "1. Where errors show up (4 min)",
        points: [
          "Browser console and Network tab: errors in what the user sees and in calls to the server or Supabase.",
          "Terminal running npm run dev: build errors and server errors.",
          "Vercel, your deployment, Logs: errors that happen only on the live site.",
          "First step is always the same: read the actual error message and note which of the three places it came from.",
        ],
      },
      {
        title: "2. Asking Copilot to help debug (5 min)",
        points: [
          "Give it the error text, the file, and what you expected. 'It does not work' gives it nothing to go on.",
          "Use the /fix command on selected code, or paste the error into Chat with the file added as context.",
          "Ask for the cause before the fix: 'Explain why this happens, then suggest the smallest fix.' Smaller fixes are easier to review.",
          "If an answer does not work after two tries, stop. Re-read the error, add more context, or try a different model.",
        ],
        example: "I get this error when I click Add:\n<paste the exact error>\nFile: app/page.tsx (added as context).\nExpected: the new row appears in the list.\nExplain the cause first, then give the smallest fix.",
      },
      {
        title: "3. Works on my machine, fails live (3 min)",
        points: [
          "The usual causes: a missing environment variable in Vercel, a different Node version, a policy that blocks the live user, or a build that is stricter than npm run dev.",
          "Run npm run build locally before you push. If it fails there, it will fail on Vercel.",
        ],
      },
      {
        title: "4. Fix without breaking something else (3 min)",
        points: [
          "Change one thing at a time and test after each change.",
          "Commit when it works so you can always return to a good state.",
        ],
      },
    ],
    demo: [
      "Break the demo app three ways: (1) a typo in a column name, (2) a missing variable in Vercel, (3) a build error from an unused import or type error.",
      "For each: say where the error shows up, copy it into Chat with a good prompt, apply the smallest fix, and test.",
      "Show npm run build locally catching the type error before it reaches Vercel.",
      "Show the Vercel deployment Logs for the missing variable case and fix it in Environment Variables.",
    ],
    lab: {
      steps: [
        "Your app should have at least one real bug or missing piece. If everything works, test harder: empty form, very long text, refresh, sign out and back in.",
        "Find one failure. Write down where it showed up (console, terminal or Vercel logs) and the exact error text in NOTES.md.",
        "Ask Chat for the cause first, then for the smallest fix. Apply, test, and commit.",
        "Run npm run build locally and fix any warning or error it shows.",
        "Push and confirm the live site still works.",
        "Swap with a neighbour: they try to break your app and tell you one failure; you fix it.",
      ],
      doneWhen: [
        "NOTES.md has one bug with its error text, cause and fix.",
        "npm run build passes locally.",
        "The live site works after your fix.",
      ],
    },
    share: "Two or three people tell the bug that took longest and what finally found it. Then mark the lab complete and take the quiz.",
    homework: ["Keep a 'bugs I fixed' list in NOTES.md. It becomes your Monday write-up of challenges and fixes.", "Library: Day 12 (debugging with Copilot), Day 4 (Copilot Chat)."],
    facilitator: [
      "If nobody has a bug, plant one from the neighbour swap; do not let people leave with an untested app.",
      "Praise the habit of reading the error text before asking for help.",
    ],
  },
  s06: {
    objective: "Use Copilot to write tests for your app's main flow, and check that the tests actually test something.",
    before: ["Your week 2 app in VS Code.", "Be ready to add a test tool; we use Vitest."],
    teach: [
      {
        title: "1. Why test (2 min)",
        points: [
          "A test is a small program that checks your code still does what you said it should do. It catches breakage the moment you cause it.",
          "You do not need to test everything. Test the logic that matters: the main flow and the rules that would hurt if wrong.",
        ],
      },
      {
        title: "2. A first test with Vitest (4 min)",
        points: [
          "Install: npm install -D vitest. Add \"test\": \"vitest run\" to the scripts in package.json. Run with npm test.",
          "Put logic that can be tested in plain functions, outside the page component. Example: a function that works out leave days between two dates.",
          "A test has a name, an input, and an expected result.",
        ],
        example: "import { expect, test } from 'vitest'\nimport { leaveDays } from './leave'\n\ntest('counts both the first and last day', () => {\n  expect(leaveDays('2026-11-02', '2026-11-04')).toBe(3)\n})",
      },
      {
        title: "3. Asking Copilot for tests (5 min)",
        points: [
          "Select a function and ask: 'Write Vitest tests for this. Include normal cases, edge cases and invalid input.'",
          "Check them: does each test have a clear name, a realistic input and an expected value you agree with? A test that just repeats the code proves nothing.",
          "Always include negative cases: empty text, wrong dates, a number below zero, a missing field.",
        ],
      },
      {
        title: "4. Make sure the test can fail (4 min)",
        points: [
          "Break the code on purpose and see the test go red. If it stays green, the test is useless.",
          "Fix the code, see it go green. This is the red / green habit.",
          "Do not let Copilot change a test just to make it pass without understanding why it failed.",
        ],
      },
    ],
    demo: [
      "Take the leave tracker. Move the date logic into lib/leave.ts.",
      "Install Vitest, add the script, and run npm test with no tests to see the setup works.",
      "Select leaveDays and ask Chat for tests with edge cases. Review the output and remove one weak test.",
      "Run: green. Break leaveDays (off by one): red. Fix: green.",
      "Show the negative case: an end date before the start date must be rejected.",
    ],
    lab: {
      steps: [
        "Find the main rule or calculation in your app (validation, a total, a status change). Move it into a plain function in its own file.",
        "Install Vitest and add the test script.",
        "Ask Chat for tests for that function: normal, edge and invalid cases. Review each one.",
        "Run npm test. Then break the function on purpose to see a test fail, and fix it.",
        "Add at least one test for something that must be rejected.",
        "Commit. Add the test count and what they cover to NOTES.md.",
      ],
      doneWhen: ["npm test passes with at least three meaningful tests.", "You have seen at least one test fail because of a deliberate bug.", "The tests are committed."],
    },
    share: "Two or three people show a test that caught a real mistake. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow is the Friday call (Nov 6): finish, deploy and harden app 2.", "Library: Day 13 (unit tests with Copilot)."],
    facilitator: [
      "Many pain points have little logic. Help people find one rule worth testing (validation, a status change, a count).",
      "Watch for tests that copy the implementation line for line.",
      "Browser-level tests come later through the Playwright connector in session 8.",
    ],
  },
};
