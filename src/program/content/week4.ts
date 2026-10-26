import type { SessionContent } from "../sessions";

// Week 4: integrations, custom instructions, pull requests and refactoring.
export const WEEK4: Record<string, SessionContent> = {
  s10: {
    objective: "Connect your app to the outside world: send an email, receive a webhook, or run a scheduled job, from a Next.js API route.",
    before: ["Your new week 4 pain point.", "An account on an email service with a free tier (your facilitator will name it), or be ready to use a webhook test site."],
    teach: [
      {
        title: "1. Route handlers: your app's own API (3 min)",
        points: [
          "In the App Router, a file app/api/<name>/route.ts exports functions named GET or POST. That is a small server endpoint.",
          "Use it when something must happen on the server: sending mail, calling a service with a secret key, receiving a webhook.",
          "Secrets used there are read from process.env on the server, never sent to the browser.",
        ],
        example: "// app/api/notify/route.ts\nexport async function POST(request: Request) {\n  const body = await request.json()\n  // validate body, then do the work\n  return Response.json({ ok: true })\n}",
      },
      {
        title: "2. Sending an email (4 min)",
        points: [
          "Use an email service's SDK or API with a key stored as an environment variable, called only from the server.",
          "Send from an address the service allows (the service's test sender is fine for training). Use your own email as the recipient.",
          "Validate the input (is the address valid, is the text a sensible length?) before you send. Otherwise your form becomes a way to send spam.",
          "Do not put real participants' or customers' addresses in tests.",
        ],
      },
      {
        title: "3. Webhooks (3 min)",
        points: [
          "A webhook is another service calling your URL when something happens (a payment, a form, a message).",
          "Your route must check that the call is genuine: a secret in a header or a signature. Without that, anyone can call it.",
          "Return a quick 200 and do slow work after, or the sender will retry.",
        ],
      },
      {
        title: "4. Scheduled jobs (3 min)",
        points: [
          "Vercel Cron Jobs call one of your routes on a schedule that you define in vercel.json. Use them for reminders and daily summaries.",
          "Protect the route with a secret so the public cannot trigger it.",
          "Check the plan limits for how many cron jobs and how often you can run them before you design around one.",
        ],
        example: "// vercel.json\n{ \"crons\": [{ \"path\": \"/api/daily\", \"schedule\": \"0 4 * * *\" }] }",
      },
    ],
    demo: [
      "Demo pain point: appointment booking with a confirmation email.",
      "Ask Chat for a POST route that validates name, email and slot, saves the booking, then sends a confirmation through the email SDK. Review it.",
      "Add the API key to .env.local and Vercel. Make a booking and show the email arriving.",
      "Show a bad input being refused with a 400 and a clear message.",
      "Show a webhook test: use a free request-inspector site, point a call to the route, and check the secret header is required.",
      "Show the vercel.json cron entry and the secret check on the cron route.",
    ],
    lab: {
      steps: [
        "Read your week 4 pain point and decide which integration it needs: email, webhook or scheduled job.",
        "Create the app (copilot-app-4), connect Supabase and deploy as before.",
        "Create the route handler with Chat. Add input validation first.",
        "Store the service key as an environment variable locally and in Vercel.",
        "Trigger it from your page or from a test tool and prove it works (email arrives, webhook is received, job runs).",
        "Test a bad input and a missing secret: both must be refused.",
        "Commit, push and test on the live URL.",
      ],
      doneWhen: ["The integration works on your live URL.", "Invalid input and unauthorised calls are refused.", "No key is in the code or on GitHub."],
    },
    share: "Two or three people show their integration working and the first thing they hit. Then mark the lab complete and take the quiz.",
    homework: ["Add one more automatic behaviour if time allows (a reminder, a status email).", "Library: Day 18 (APIs and integration)."],
    facilitator: [
      "Pick and approve the email provider beforehand and test the free-tier limits. Domain verification can block sending to anyone but yourself; plan for that.",
      "Cron frequency is limited on free plans. If it blocks someone, a manually triggered route is acceptable for the submission.",
      "Stress that unauthenticated routes are public. Every route needs validation, and sensitive ones need a secret.",
    ],
  },
  s11: {
    objective: "Teach Copilot how your project works by writing a custom instructions file, and reuse your best prompts.",
    before: ["Your app 4 in VS Code, with some code already in it."],
    teach: [
      {
        title: "1. Why instructions (2 min)",
        points: [
          "Copilot does not remember your project between chats. You keep repeating 'use Tailwind, TypeScript, no new libraries'.",
          "A custom instructions file is read automatically and added to every chat. Write the rules once.",
        ],
      },
      {
        title: "2. The file (4 min)",
        points: [
          "Create .github/copilot-instructions.md in your repository. VS Code picks it up for Chat in that project.",
          "Keep it short and specific: stack, folder layout, naming, what to avoid, how to run and test.",
          "Write rules you can check ('use the Supabase client from lib/supabase.ts'), not wishes ('write good code').",
          "Review it from time to time. Delete rules that no longer apply.",
        ],
        example: "# Project rules\n- Stack: Next.js (App Router), TypeScript, Tailwind, Supabase.\n- Use the client in lib/supabase.ts. Never create a second one.\n- Secrets only from process.env. Never write a key in code.\n- Validate all input in route handlers before using it.\n- Components in components/, logic that needs tests in lib/.\n- Run npm run build and npm test before saying a task is done.\n- Do not add dependencies without asking.",
      },
      {
        title: "3. Reusable prompts (4 min)",
        points: [
          "Prompt files are saved prompts in .github/prompts/<name>.prompt.md. You run one in Chat by typing / and its name.",
          "Good candidates: 'add a validated route handler', 'write tests for this function', 'explain this error'.",
          "Share them through the repository so every teammate gets the same ones.",
        ],
        example: "---\ndescription: Add a validated route handler\n---\nCreate a route handler in app/api/${input:name}/route.ts.\nValidate the body, return 400 with a clear message on bad input, and never return secrets.",
      },
      {
        title: "4. Check that it works (3 min)",
        points: [
          "After writing the file, ask Chat for something small and see whether the answer follows the rules. In the response, the instructions file appears under References.",
          "If a rule is ignored, make it shorter and more specific.",
          "Instructions guide Copilot; they do not replace your review.",
        ],
      },
    ],
    demo: [
      "Ask Chat for a new component without instructions; note it used a different style and added a library.",
      "Write the instructions file from the example. Ask for the same thing; show it now follows the rules.",
      "Show the reference to copilot-instructions.md in the answer.",
      "Create one prompt file for 'add a validated route handler' and run it with /.",
      "Commit both files.",
    ],
    lab: {
      steps: [
        "Read your own app and list five rules that a new teammate would need to know.",
        "Write .github/copilot-instructions.md with those rules (stack, folders, secrets, validation, how to test).",
        "Ask Chat for a small change and check whether it follows your rules. Tighten any rule that was ignored.",
        "Create one prompt file for a task you repeat in this app and run it.",
        "Commit and push both files.",
        "Note in NOTES.md which rule changed Copilot's behaviour the most.",
      ],
      doneWhen: ["The instructions file is committed and Copilot follows at least three rules.", "One reusable prompt file exists and works.", "No secret or personal data is in either file."],
    },
    share: "Two or three people read out their best rule and what it fixed. Then mark the lab complete and take the quiz.",
    homework: ["Keep the file current as the app grows.", "Library: Day 22 (extensions), Day 27 (tools and workflow)."],
    facilitator: [
      "Custom instructions can be off or overridden by organisation settings. Check on the lab machines first.",
      "Long vague files do not work. Push people to write fewer, checkable rules.",
    ],
  },
  s12: {
    objective: "Work like a team: make changes on a branch, open a pull request, use Copilot to review it, and refactor without breaking things.",
    before: ["Your app 4 pushed to GitHub with working tests or at least a passing npm run build."],
    teach: [
      {
        title: "1. Branches and pull requests (4 min)",
        points: [
          "Do new work on a branch (git switch -c improve-validation), not on main. Main stays working and deployed.",
          "A pull request (PR) asks to merge your branch into main. Others can review the change before it goes live.",
          "Vercel builds a preview URL for each PR, so you can click through the change before merging.",
          "Write a PR description: what changed, why, and how you tested it. Copilot can draft it; edit it.",
        ],
      },
      {
        title: "2. Copilot code review (4 min)",
        points: [
          "In VS Code you can ask Copilot to review your selection or your changes before you push (the review option in the Source Control and Chat views).",
          "On GitHub you can request Copilot as a reviewer on a PR, if it is enabled for your account.",
          "Treat comments as suggestions from a fast but fallible colleague. Accept the useful ones, and for each one you reject, know why.",
          "Look for things Copilot is good at finding: missing validation, unused code, unclear names, missing error handling.",
        ],
      },
      {
        title: "3. Refactoring safely (4 min)",
        points: [
          "Refactoring changes how code is written, not what it does. The point is code that is easier to read and change.",
          "Only refactor when tests or a reliable manual check protect you. Run them before, and after every step.",
          "Ask Chat for one step at a time: 'Extract this block into a function named ...', 'Rename this variable everywhere', 'Remove the duplicate code'.",
          "Keep the refactor in its own commit, separate from new features.",
        ],
      },
      {
        title: "4. Responding to review comments (3 min)",
        points: [
          "Reply to every comment: fixed, or why not. Push the fix to the same branch and the PR updates itself.",
          "Merge only when the checks are green and the preview works.",
        ],
      },
    ],
    demo: [
      "Create a branch for a refactor of the booking route into smaller functions.",
      "Ask Chat to extract validation into its own function. Run npm test before and after.",
      "Ask Copilot to review the changes in VS Code. Walk through two comments: accept one, reject one with a reason.",
      "Commit, push the branch, open a PR on GitHub, let Copilot draft the description, and edit it.",
      "Open the Vercel preview link in the PR. Merge and show production update.",
    ],
    lab: {
      steps: [
        "Create a branch in your repository for an improvement to app 4.",
        "Pick one thing to refactor (a long function, duplicated code, a confusing name). Run tests or a manual check first.",
        "Refactor one step at a time with Chat. Re-check after every step.",
        "Ask Copilot to review your changes. Accept at least one suggestion and reject one with a reason.",
        "Push the branch and open a pull request with a clear description.",
        "Check the Vercel preview URL, then merge into main and confirm production.",
        "Write what you changed and what the review found in NOTES.md.",
      ],
      doneWhen: ["A merged pull request with a description.", "The behaviour is the same before and after the refactor.", "You can explain one review comment you accepted and one you rejected."],
    },
    share: "Two or three people share a review comment that taught them something. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow is the Friday call (Nov 20): finish, deploy and harden app 4.", "Library: Day 14 (refactoring), Day 15 (pull requests), Day 16 (code review)."],
    facilitator: [
      "Check that Copilot code review is enabled for the organisation. If not, use the in-editor review only and say so.",
      "Branch protection is not needed here, but show how merging a failing build is visible in the PR.",
      "Confirm everyone has push access to their own repository, so the PR flow works for all.",
    ],
  },
};
