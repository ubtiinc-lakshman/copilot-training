// Common GitHub Copilot days 0-7 (all five teams together). Approved by the Director on Oct 29; dates are a draft for review.
// Pages: /common and /common/c0 ... /common/c7. Completion is stored in `completions` under the id (c0 ... c7).
// Content mirrors `COMMON` in tracks.ts (the syllabus) with the detail participants and facilitators need.
import type { SessionContent } from "./sessions";

export type CommonDay = { id: string; day: number; date: string; title: string; length: string; gate?: boolean };

// Full days, Mon-Fri back to back (Nov 2-6, then Nov 10-12; Nov 9 is a holiday (Diwali, confirmed Oct 29); other dates still proposed, leadership is planning); the weekly app program is now self-paced.
export const COMMON_DAYS: CommonDay[] = [
  { id: "c0", day: 0, date: "2026-11-02", title: "Concepts and terminology", length: "Full day" },
  { id: "c1", day: 1, date: "2026-11-03", title: "Copilot fundamentals", length: "Full day" },
  { id: "c2", day: 2, date: "2026-11-04", title: "Prompt and context engineering", length: "Full day" },
  { id: "c3", day: 3, date: "2026-11-05", title: "Copilot for day-to-day engineering work", length: "Full day" },
  { id: "c4", day: 4, date: "2026-11-06", title: "Security, privacy and responsible use", length: "Full day" },
  { id: "c5", day: 5, date: "2026-11-10", title: "Advanced Copilot and agentic working", length: "Full day" },
  { id: "c6", day: 6, date: "2026-11-11", title: "Guided hands-on: one business problem", length: "Full day" },
  { id: "c7", day: 7, date: "2026-11-12", title: "Common level gate", length: "Full day", gate: true },
];

export const getCommonDay = (id: string) => COMMON_DAYS.find((d) => d.id === id);

const PROMPT = "Goal + Context + Constraints + Expected output";

export const COMMON_CONTENT: Record<string, SessionContent> = {
  c0: {
    objective: "Share one vocabulary across Dev, QA, Power BI, Fabric and AI: the Git and engineering terms used all through the program, the Copilot modes, and the basic risks.",
    before: ["VS Code (or your usual IDE) with GitHub Copilot signed in. Check: open Chat and ask it anything.", "Nothing to prepare beyond that. No prior Git knowledge is assumed."],
    teach: [
      {
        title: "1. Git and GitHub in plain words",
        points: [
          "Repository: the folder of a project plus its full history. Branch: your own line of work. Commit: a saved version with a message. Pull request: a request to merge your branch, where others review it.",
          "Merge brings a branch back. Review is a colleague reading your change before it merges. Copilot can review too, but it never replaces the human.",
        ],
      },
      {
        title: "2. Build, debug, test, log",
        points: [
          "Build turns source into something that runs. Debugging is finding why it does not behave as expected. A log is what the program wrote down while running.",
          "Unit test: checks one small piece. Regression test: checks that something that worked still works after a change.",
          "Data teams: the same words apply to a query, a notebook, a pipeline or a report. QA: a test case or script is the artifact you build and debug.",
        ],
      },
      {
        title: "3. Copilot modes and context",
        points: [
          "Inline suggestions complete as you type. Ask answers questions and explains. Edit changes the files you point at. Agent plans and makes changes across many files and can run commands.",
          "Context is what Copilot can see: the open file, selected code, files you add, the workspace, the repository. Better context gives better answers.",
          "Premium models and long agent runs use more of your allowance.",
        ],
      },
      {
        title: "4. How to ask, and what can go wrong",
        points: [
          `A good prompt has four parts: ${PROMPT}.`,
          "Hallucination: a confident answer that is wrong or invented. Prompt injection: text in a file or web page that tries to give Copilot new instructions. Secrets: keys and passwords, which never go into a prompt or a commit.",
          "You are accountable for what you accept. Always validate.",
        ],
        example: "Goal: Explain what this function does.\nContext: it is part of our order service, written in C#.\nConstraints: assume I know the language but not this codebase.\nOutput: three bullet points, then one risk you notice.",
      },
    ],
    demo: [
      "Open any small repository in VS Code. Show the Source Control panel: branch, change, commit message, push.",
      "Show the Chat panel and switch between Ask, Edit and Agent. One sentence on what each is for.",
      "Ask the same question twice: once with no context, once with a file added. Compare the answers.",
      "Show a wrong answer on purpose (ask about a function that does not exist) and how to catch it.",
    ],
    lab: {
      steps: [
        "Match the terms: your facilitator shares a list of 12 terms; match each to its meaning and to one example from your own team's work.",
        "In your IDE, make a branch, change one line, and commit it with a message that says what and why.",
        "Ask Copilot to explain a file from your team's work (sanitized or sample). Do it twice, with and without the file added as context.",
        `Rewrite one of your own earlier prompts using ${PROMPT} and compare the result.`,
        "Write down one thing Copilot got wrong or invented, and how you spotted it.",
      ],
      doneWhen: ["You can explain branch, commit and pull request to a colleague.", "You can name the four Copilot modes and when to use each.", "You wrote one prompt with all four parts and noted one wrong answer."],
    },
    share: "Each person says one term that was new and one team example of it.",
    homework: ["Open Chat once a day before Day 1 and ask it one real question from your work.", "No real customer data, credentials or keys in any prompt."],
    facilitator: [
      "Mixed audience: keep every example short and let people name their own artifact (code, test case, query, report, notebook).",
      "Check sign-in to Copilot at the start. Anyone without a licence tells you now, not on Day 1.",
      "This day has no quiz. Completion is the button on the page.",
    ],
  },
  c1: {
    objective: "Use Copilot's inline suggestions and Chat for the five basic jobs (ask, explain, fix, generate, review), and know its limits.",
    before: ["Copilot signed in on your IDE.", "A small piece of your own work to practice on (a source file, a test script, a query or a report measure). Sanitized."],
    teach: [
      {
        title: "1. AI pair programming",
        points: ["Copilot is a fast assistant sitting next to you, not an authority. It predicts likely text from what it can see.", "You decide what is kept. The skill you are learning is directing it and checking it."],
      },
      {
        title: "2. The five jobs",
        points: [
          "Ask: a question about code, a tool or a concept. Explain: what does this do and why. Fix: what is wrong with this error. Generate: write something new. Review: what could go wrong here.",
          "Use the slash helpers in Chat where available (for example /explain, /fix, /tests) and select the code first.",
          "Inline suggestions: Tab accepts, Esc rejects. Good for small, obvious code once you know what you are writing.",
        ],
      },
      {
        title: "3. Limits",
        points: ["It can be wrong, outdated or invented, and it can sound sure. It does not know your private business rules unless you tell it.", "A suggestion that runs is not the same as a suggestion that is right. Test it."],
      },
    ],
    demo: [
      "Select a function, run Explain, then ask a follow-up about one line.",
      "Paste a real-looking error, run Fix, and review the diff before accepting.",
      "Generate a small new function from a one-sentence description. Show what it assumed.",
      "Review: ask for risks in a selected block. Show one useful finding and one that is noise.",
    ],
    lab: {
      steps: [
        "Pick one artifact from your work. Run Explain on it and write the explanation in your own words next to Copilot's.",
        "Introduce a small bug or error (or use a known one). Use Fix and compare with your own diagnosis.",
        "Generate one small new piece of work with a one-sentence ask. List what Copilot assumed that you did not say.",
        "Run Review on the result. Keep two comments, reject one, and say why.",
        "Try one inline suggestion in each style: accept one, reject one.",
      ],
      doneWhen: ["You used Ask, Explain, Fix, Generate and Review once each.", "You can name two limits you hit.", "Every accepted change was read and tested."],
    },
    share: "One thing Copilot did well, one thing it got wrong.",
    homework: ["Use Chat on a real task at work before Day 2. Note the prompt and whether you kept the answer.", "Library: Day 3 (inline suggestions), Day 4 (Copilot Chat), Day 5 (prompt basics)."],
    facilitator: ["Weekly session s01 covers the same ground for developers; non-developers need artifact examples of their own.", "Slash command names change between versions; if one is missing, ask in plain words."],
  },
  c2: {
    objective: "Write prompts with clear structure, iterate and chain them, and give Copilot the right context (file, workspace, repository) so the answer fits your situation.",
    before: ["The work artifact you used on Day 1.", "Your best and worst prompt from the past week."],
    teach: [
      {
        title: "1. Prompt structure",
        points: [`${PROMPT}. Say all four; leave none to guesswork.`, "Name the role or audience when it matters (for example 'for a new joiner')."],
        example: "Goal: Write test cases for the login requirement below.\nContext: web app, email + password, lockout after 5 failures. Requirement text is attached.\nConstraints: functional, negative and boundary cases only; no real accounts.\nOutput: a table with ID, steps, expected result.",
      },
      {
        title: "2. Iterate and chain",
        points: ["A short follow-up beats starting over: 'make it shorter', 'add boundary cases', 'use our naming'.", "Chaining: split a big job into steps. Plan first, review the plan, then ask for the output, then ask for a check."],
      },
      {
        title: "3. Context",
        points: ["File: what you have open or add with #file. Workspace and repository: the wider project (use #codebase or the equivalent).", "Too little context gives generic answers. Too much gives noise; add only what matters.", "Avoid ambiguity: 'the function' becomes the function name; 'fast' becomes a number."],
      },
      {
        title: "4. Reusable prompts",
        points: ["Keep prompts that worked in a notes file. A good prompt is a template: replace the Context and Output lines and reuse."],
      },
    ],
    demo: [
      "Run one vague prompt and one four-part prompt on the same task. Compare.",
      "Chain: ask for a plan, change one item, then ask for the output.",
      "Same prompt with no context, with one file, with the repository. Show the three answers.",
      "Turn the winning prompt into a template with placeholders.",
    ],
    lab: {
      steps: [
        "Take your worst prompt from last week and rewrite it with all four parts. Run both.",
        "Chain a task of your own in three steps: plan, output, check. Write down what you changed after each step.",
        "Run one prompt with no context, then with the right file or repository context. Note the difference.",
        "Remove one ambiguity from a prompt (a vague word replaced by a name or number) and see what changes.",
        "Save your two best prompts as templates in a notes file.",
      ],
      doneWhen: ["Before and after prompts are side by side with a clear difference.", "One chained task with a note after each step.", "Two reusable templates saved."],
    },
    share: "One before/after prompt pair.",
    homework: ["Use a template on a real task and note what you adjusted.", "Library: Day 5 (prompt engineering). The Prompt Engineering program recordings are the short refresher."],
    facilitator: ["Source: reuse the Prompt Engineering program (sessions 1-3) examples; swap in each team's artifacts.", "Watch for people pasting whole repositories; teach selecting the right file."],
  },
  c3: {
    objective: "Use Copilot for the everyday work that surrounds writing: understanding existing artifacts, documentation, user stories and acceptance criteria, test scenarios, debugging, and explaining code, queries and data.",
    before: ["One real (sanitized) artifact from your team: a source file, a requirement, a test script, a query, a report or a pipeline."],
    teach: [
      { title: "1. Understand before you change", points: ["Ask Copilot to explain an unfamiliar artifact, then list its inputs, outputs and risks. Check against what you can see."] },
      { title: "2. Write the words around the work", points: ["Documentation, user stories, acceptance criteria and a README are strong uses: you supply the facts, Copilot shapes the text.", "Always check names, numbers and promises it adds."] },
      { title: "3. Test scenarios and debugging", points: ["Ask for functional, negative and boundary scenarios from a requirement. Add the error text and context when debugging; ask for causes ranked by likelihood.", "Verify a fix by running it, not by reading it."] },
      { title: "4. Explain code, queries and data", points: ["Ask for a plain-language explanation of a query or a measure, then ask what happens with empty or odd data."] },
    ],
    demo: [
      "Explain an unfamiliar function, then ask for its risks.",
      "Turn a rough requirement into a user story with acceptance criteria.",
      "Generate test scenarios, then ask 'what is missing?'.",
      "Debug a seeded error with the error text and the surrounding code as context.",
    ],
    lab: {
      steps: [
        "Explain your own artifact with Copilot. Mark one thing it got right and one thing it missed.",
        "Create a short document for it (README, story, criteria, data dictionary, runbook) and fix every fact that is wrong.",
        "Generate test scenarios (functional, negative, boundary) for something in your artifact. Add the two it missed.",
        "Debug one real or seeded problem using the error text. Record the cause and how you proved the fix.",
      ],
      doneWhen: ["Explanation checked against the artifact.", "A document with the wrong facts corrected.", "Scenarios list includes your own additions.", "A fix verified by running it."],
    },
    share: "One fact Copilot got wrong in the document.",
    homework: ["Do the same on one more artifact at work.", "Library: Day 12 (bugs and triage), weekly sessions s05 and s06 (debugging and tests)."],
    facilitator: ["Reuses weekly s05 and s06. Teams bring their own artifacts, so circulate by team.", "Insist on running the fix. 'It looks right' is the failure mode."],
  },
  c4: {
    objective: "Use Copilot safely: keep sensitive data and secrets out of prompts, understand licensing and organization policy, and check generated code for security problems.",
    before: ["Read the training rule: fake data only, no credentials in prompts.", "Your facilitator shares the organization's current Copilot policy settings on screen."],
    teach: [
      { title: "1. What must not go in a prompt", points: ["Passwords, keys, tokens, connection strings, customer or employee data, unreleased business information.", "Replace with placeholders or generated sample data."] },
      { title: "2. Licensing, IP and policy", points: ["Suggestions can resemble public code. Know whether the public-code matching setting is on for your organization.", "Content exclusion lets an organization keep chosen files away from Copilot. Know what your organization has set.", "Your facilitator confirms which features (agent, MCP, Copilot code review) are enabled."] },
      { title: "3. Secure code and secure prompting", points: ["Generated code can have injection flaws, weak validation, hard-coded secrets and outdated libraries. Review it like a colleague's code.", "Prompt injection: instructions hidden in files, issues or web pages that Copilot reads. Treat tool output and fetched text as untrusted.", "Ask for the secure version explicitly, then still review."] },
      { title: "4. Accountability", points: ["You own what you commit. Name Copilot in the PR description when it wrote much of it; a human approves every merge."] },
    ],
    demo: [
      "Take a prompt with a fake API key in it. Show what to redact and why.",
      "Generate a small database query function; spot the injection risk; ask for the safe version.",
      "Show a file with a hidden instruction and what happens when it is added as context.",
      "Show where the organization's Copilot policy settings can be read.",
    ],
    lab: {
      steps: [
        "Sanitize three prompts that contain secrets or customer-like data. Write the safe version of each.",
        "Generate code for a task of your team, then run a security review prompt on it. List the findings you agree with.",
        "Fix one finding and re-run the check.",
        "Write a one-page 'safe prompting' rule list for your own team (5 to 7 rules).",
      ],
      doneWhen: ["Three redacted prompts.", "At least one real finding fixed.", "A rule list your team could adopt."],
    },
    share: "One rule from your list.",
    homework: ["Find one place in your current work where sensitive data could end up in a prompt and tell your lead.", "Library: Day 24 (security review), Day 9."],
    facilitator: ["Policy content is new: get the actual settings (public-code matching, content exclusion, enabled features) from the admin before this day and show them.", "Never demonstrate with a real key; use a clearly fake one."],
  },
  c5: {
    objective: "Work with Agent Mode safely: plan, execute and validate in steps, set standing rules with custom instructions and prompt files, know what MCP is, and recover when the agent goes wrong.",
    before: ["A small project or document set you may change freely (a copy, in a branch).", "Git installed and the project committed, so you can roll back."],
    teach: [
      { title: "1. Agent Mode: plan, execute, validate", points: ["The agent plans, edits several files, can run commands, and tries again on errors. It uses more allowance than Chat.", "Ask for the plan first. Approve each step or batch. Validate by running tests or opening the result."] },
      { title: "2. Custom instructions and prompt files", points: ["A repository instructions file (for example .github/copilot-instructions.md) gives Copilot standing rules: stack, naming, things to avoid.", "A prompt file stores a reusable prompt so the team runs the same request the same way."] },
      { title: "3. MCP awareness", points: ["Model Context Protocol lets Copilot use external tools (for example GitHub, a database, a browser). More power, more risk: check what a tool can read or change before adding it."] },
      { title: "4. Approval, rollback, recovery", points: ["Commit before the agent starts. Review changes file by file. If it goes wrong, discard the changes (git restore or reset to your commit) and restart with a tighter prompt."] },
    ],
    demo: [
      "Commit the project. Ask the agent for a plan for a small change. Edit the plan.",
      "Let it execute with approval on each step. Run the tests.",
      "Add a repository instructions file and re-run the same ask: show the difference.",
      "Make the agent do something wrong, then roll back with git.",
    ],
    lab: {
      steps: [
        "Commit your starting point. Write a one-page instructions file for your area (5 to 8 rules).",
        "Create one prompt file for a task you repeat.",
        "Use Agent Mode on a small change. Approve step by step; write down each approval decision.",
        "Review every changed file and run the validation (tests, query, open the report).",
        "Roll the change back once on purpose and confirm you are back at your commit.",
      ],
      doneWhen: ["Instructions file and prompt file committed.", "An agent change reviewed file by file and validated.", "Rollback performed once."],
    },
    share: "One rule from your instructions file that changed Copilot's behavior.",
    homework: ["Try the agent on a safe, real task from your team and keep the plan, the decisions and the result.", "Library: Day 21, 22, 27. Weekly sessions s07, s08, s11 (agent, MCP, instructions)."],
    facilitator: ["Confirm before the day whether Agent Mode and MCP are enabled for the organization; use a fallback demo if not.", "Credits: agent runs are the heaviest use. Keep the lab change small."],
  },
  c6: {
    objective: "Apply Days 1-5 to one business problem. Every team gets the same brief and the same fake data, and produces the output that fits its own role.",
    before: ["Your instructions file and best prompt templates from Days 2 and 5.", "Sit with your team. Each team keeps one shared folder for its output.", "Fake data only: the ticket list below is invented. Do not bring real tickets."],
    teach: [
      {
        title: "1. The brief: the support backlog at BrightDesk",
        points: [
          "BrightDesk is an invented company with an internal IT helpdesk. Over the last two weeks the backlog has grown and the support lead cannot say why. Leadership asks: where is the time going, and what should we do in the next 30 days?",
          "You have 20 sample tickets (below). They are a small sample, so say so in anything you present. Do not claim more than 20 tickets can show.",
          "Service targets (SLA): P1 first response within 1 hour and resolved within 8 hours. P2: 4 hours and 24 hours. P3: 8 hours and 72 hours. A ticket breaches when it is slower than its target.",
        ],
      },
      {
        title: "2. The ticket data (CSV, 20 rows)",
        points: ["Columns: ticket_id, opened, category, priority, status, first_response_hrs, resolved_hrs (blank while open), assigned_team."],
        example: "ticket_id,opened,category,priority,status,first_response_hrs,resolved_hrs,assigned_team\nT-1001,2026-10-05,Password reset,P3,Resolved,0.5,1.0,Identity\nT-1002,2026-10-05,VPN,P1,Resolved,3.5,14.0,Network\nT-1003,2026-10-06,Laptop,P2,Resolved,2.0,30.0,Endpoint\nT-1004,2026-10-06,Password reset,P3,Resolved,0.4,0.8,Identity\nT-1005,2026-10-07,Email,P2,Resolved,1.5,6.0,Service Desk\nT-1006,2026-10-07,Software install,P3,Resolved,6.0,20.0,Endpoint\nT-1007,2026-10-08,VPN,P1,Resolved,2.5,9.5,Network\nT-1008,2026-10-08,Password reset,P3,Resolved,0.6,1.2,Identity\nT-1009,2026-10-09,Access request,P3,Resolved,9.0,60.0,Identity\nT-1010,2026-10-12,Password reset,P3,Resolved,1.0,2.0,Identity\nT-1011,2026-10-12,Password reset,P3,Resolved,1.2,2.5,Identity\nT-1012,2026-10-12,VPN,P2,Resolved,5.0,26.0,Network\nT-1013,2026-10-12,Laptop,P1,Resolved,1.0,7.0,Endpoint\nT-1014,2026-10-13,Software install,P3,Resolved,4.0,18.0,Endpoint\nT-1015,2026-10-13,Password reset,P3,Resolved,0.7,1.5,Identity\nT-1016,2026-10-14,Email,P3,Resolved,3.0,10.0,Service Desk\nT-1017,2026-10-14,VPN,P1,Open,4.0,,Network\nT-1018,2026-10-15,Laptop,P2,Open,3.0,,Endpoint\nT-1019,2026-10-15,Software install,P3,Waiting,5.5,,Endpoint\nT-1020,2026-10-16,Password reset,P3,Resolved,0.5,1.0,Identity",
      },
      {
        title: "3. Your team's output (pick the one for your role)",
        points: [
          "Application Development: a small, working helper that reads the tickets and flags each one that breaches its SLA, with a unit test that includes a boundary case (exactly on target) and a bad row (missing value).",
          "QA: a test strategy and at least 12 test cases for the SLA-breach rule, with positive, negative and boundary cases, and a note on what you would automate first.",
          "Power BI: KPI definitions (for example breach rate, median first response), a star-schema sketch, three DAX measure ideas with how you would check each by hand, and a one-page report outline.",
          "Fabric/Data: a source-to-target mapping for these tickets and one transformation (SQL or PySpark) that adds first-response and resolution breach flags, plus two data-quality checks.",
          "AI: a plan for a feature that answers 'how do we usually fix this?' from past tickets, with where the knowledge comes from, how answers cite their source, one failure case, and one prompt-injection risk.",
        ],
      },
      {
        title: "4. How it is judged",
        points: [
          "Correct and checked: you validated against the data, not just produced text. Clear prompts with the right context. No sensitive data anywhere.",
          "A short list of what Copilot got wrong and how you caught it. This matters more than a perfect first draft.",
        ],
      },
    ],
    demo: [
      "The facilitator takes the Application Development output as the example: prompt Copilot with the CSV and the SLA rules, show the first draft, then check one result by hand (T-1002: P1, first response 3.5 hours, so it breaches).",
      "Show one thing the draft got wrong (for example reading a blank resolved_hrs as 0) and how adding the open tickets to the test catches it.",
      "Show the other roles' outputs only as a one-line example each, so teams know the level expected.",
    ],
    lab: {
      steps: [
        "Read the brief and the data. As a team, write down in two sentences what your role's output is and what 'correct' means for it.",
        "Write a structured prompt (goal, context, constraints, output) and paste the CSV and SLA rules as context. Generate a first draft.",
        "Validate it against the data: pick at least three tickets and check them by hand, including one open ticket and one boundary case.",
        "Fix what is wrong. Record every error Copilot made and how you caught it.",
        "Add your repository or team instructions file if it helped, and save the final output in your team folder.",
        "Prepare a 2-minute show-and-tell: the output, one error caught, one thing you would do next.",
      ],
      doneWhen: ["Your role's output exists and at least three tickets were checked by hand.", "You listed at least two errors Copilot made and how you handled them.", "Your team can present in 2 minutes."],
    },
    share: "Each team shows its output in 2 minutes: the result, one error caught, one next step.",
    homework: ["Revise your output with the feedback you got.", "Day 7 is the gate: review your notes from Days 1-5 and your prompt templates. It is open book."],
    facilitator: [
      "Facts in the data (for your own check): 20 tickets; password resets are 7 of 20 (35%) and quick; VPN has 4 tickets and all 4 breach, average first response 3.75 hours, all owned by Network. First-response breaches: T-1002, T-1007, T-1009, T-1012, T-1017. Resolution breaches: T-1002, T-1003, T-1007, T-1012. Three tickets are not resolved (T-1017, T-1018, T-1019).",
      "Good insights: password resets are high volume but cheap, so automate or self-serve them; the real SLA pain is VPN and Network. Weak answers say 'password resets are the problem' or claim trends from 20 rows.",
      "Common Copilot errors to watch for: blank resolved_hrs read as zero; comparing hours to the wrong priority; counting an open ticket as resolved; inventing columns; confident claims about 'trends' from a tiny sample.",
      "Not scored. Use the Day 7 rubric loosely so people see the bar. Walk around each team in turn and ask 'how did you check that?'.",
    ],
  },
  c7: {
    objective: "Show, in a practical assessment, that you can choose the right Copilot capability, write a structured prompt, supply context, validate the result and stay inside the security rules.",
    before: ["Your notes and templates (open book).", "Pass mark: 70% (proposed; Director to confirm)."],
    teach: [{ title: "How the gate works", points: ["Five tasks, one per area: prompting, context, feature choice, validation, security. Each scored 0-2 against a rubric by a facilitator.", "A retake is offered within a week if you score below the pass mark."] }],
    demo: ["The facilitator walks through one scored example so the rubric is clear."],
    lab: {
      steps: [
        "Prompting: turn a vague request into a structured prompt and run it.",
        "Context: improve the answer by supplying the right file or repository context. Say why.",
        "Feature choice: for three small jobs, name the mode or feature you would use (inline, Ask, Edit, Agent, instructions, prompt file) and why.",
        "Validation: find the error in a Copilot-written output and prove it.",
        "Security: find and fix the sensitive data or insecure code in the sample.",
      ],
      doneWhen: ["All five tasks submitted.", "A facilitator has scored them."],
    },
    share: "Results are shared individually, with feedback.",
    homework: ["Passed: you have completed the common days.", "Below the pass mark: a short retake with your facilitator."],
    facilitator: [
      "Pass mark 7 of 10 is a proposal until the Director confirms it. Keep the answer key out of the public repo (see HANDOFF gap 4 and 5).",
      "Tasks and scoring guide are in the facilitator doc (not in this repo, because it contains the answers): GitHub Copilot Training - Day 7 Gate Tasks and Scoring (Facilitator).docx. Hand out Part A on the day.",
      "Record scores in the Results export; nothing is automated yet.",
    ],
  },
};
