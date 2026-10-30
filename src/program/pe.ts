// Prompt Engineering course content (participant-facing only). Adapted from the Prompt Engineering Enablement Program materials.
// Facilitator guides, scoring notes and quiz answers are deliberately NOT here; quizzes live in the database.
import { PE_TRACKS, type PeTrack } from "@/lib/pe";

export type Block = { title: string; points: string[]; example?: string; docs?: string[] }; // docs = library document slugs shown as links
export type Lab = { scenario: string; tasks: string[]; doneWhen: string[] };
export type Unit = { id: string; level: 1 | 2 | 3; title: string; objective: string; blocks: Block[]; lab: Lab };

export const LEVELS = [
  { n: 1, title: "Foundation", blurb: "The 6-element prompt formula, five core principles and safe use of AI. Everyone starts here." },
  { n: 2, title: "Your team track", blurb: "Role-specific prompting for your own work. Pick the track that matches your team." },
  { n: 3, title: "Assessment and adoption", blurb: "Chain prompts, show your skills on a real work scenario, and add a prompt to the shared repository." },
] as const;

const FORMULA = `You are a [ROLE].

[GOAL: what you want done]

Context:
[background that matters: stack, data, users, rules]

Constraints:
[limits, requirements, what NOT to do]

Format:
[how the output should be structured]

Evaluation:
[how you will judge whether the output is good]`;

export const FOUNDATION: Unit = {
  id: "l1",
  level: 1,
  title: "Foundation: write prompts that work",
  objective: "Write a structured prompt with the 6-element formula, improve it by iterating, and use AI without leaking confidential data.",
  blocks: [
    {
      title: "The 6-element formula",
      points: [
        "Role: who the AI should be. Goal: what you want. Context: the background that matters. Constraints: limits and requirements.",
        "Format: how the answer is laid out. Evaluation: how you will judge if it is good.",
        "You do not need every element every time, but a prompt with most of them beats a one-liner almost always.",
      ],
      example: FORMULA,
    },
    {
      title: "Five core principles",
      points: [
        "Specificity drives quality: name the stack, the scenario and the output. Replace words like good, best and modern with specifics.",
        "Context improves usefulness: tell the AI your situation (tech, data, users, rules) or it fills the gaps with generic guesses.",
        "Constraints improve reliability: say what to include, what to avoid, who the audience is and the quality bar.",
        "Iteration is normal: draft, review, find the gaps, refine the prompt, re-run. Expect at least one refinement.",
        "AI is an assistant, not an authority: you own the result. Review, test and get an expert to check anything important.",
      ],
      example: `Weak:   Write code for login
Better: You are a senior .NET developer. Write a minimal-API endpoint for email/password login that returns a JWT.
        Context: .NET 8, SQL Server, multi-tenant. Constraints: rate limit 5 attempts/min, no plain-text passwords in logs.
        Format: the endpoint code, then 3 bullets on what to review.`,
    },
    {
      title: "Safe use: what never goes into a prompt",
      points: [
        "Never paste secrets (passwords, API keys, tokens, connection strings), customer data (names, emails, account numbers), confidential business or legal material, or sensitive internal identifiers.",
        "Anonymise and use placeholders: [CUSTOMER_NAME], [DATABASE_HOST], [SECRET_STORE]. Share the pattern, not the specifics.",
        "Before pasting ask: is there a credential, personal data or anything marked confidential? Would I be comfortable seeing it in a public GitHub issue?",
        "Validate every output for accuracy, completeness, relevance and compliance before you use it.",
      ],
      example: `INSTEAD OF: Connect to prod-db-01.company.com as customer_user / P@ssw0rd123
USE:        Connect to a database server at [DATABASE_HOST] using credentials stored in [SECRET_STORE]`,
    },
    {
      title: "Reference material and workbook",
      points: ["Keep the cheatsheet open while you work. The workbook has the full lab text."],
      docs: ["foundation-playbook", "lab-1-foundation-session", "prompt-formula-cheatsheet", "core-principles", "common-mistakes-decoder", "05-safety-governance-guidelines"],
    },
    {
      title: "Common mistakes and the fix",
      points: [
        "Too vague: use the formula. Missing context: add stack, scale, rules. No constraints: list include and exclude.",
        "Five questions in one prompt: split them. No iteration: read the output, name what is missing, ask again.",
        "Trusting the output: build a validation habit. Output too generic: add context. Wrong format: describe the exact structure. Too long: set a length limit.",
      ],
    },
  ],
  lab: {
    scenario: "Prompt Rescue. Three weak prompts need rescuing: (1) \"Write code for login\", (2) \"Create a dashboard\", (3) \"Explain this error\".",
    tasks: [
      "For each weak prompt, write down what is missing and what the AI would have to assume.",
      "Rewrite prompt 1 (or the one closest to your work) with the 6-element formula. Put this in 'Initial prompt'.",
      "Run it in your AI tool (Copilot Chat or any approved tool). Summarise the output in 3 to 5 bullets.",
      "Find what is still missing, refine the prompt and run again. Put the improved version in 'Refined prompt'.",
      "Write validation notes: what you would check before using it, what the AI assumed, what could go wrong. Use no real secrets or customer data.",
    ],
    doneWhen: [
      "Your initial prompt uses most of the six elements and is specific to your context.",
      "The refined prompt shows a real improvement based on the output.",
      "Your validation notes show critical thinking.",
    ],
  },
};

const TRACK_DOCS: Record<PeTrack, string[]> = {
  saas: ["saas-dev-playbook", "lab-2-saas-dev-team"],
  powerbi: ["power-bi-platform-playbook", "lab-3-power-bi-platform", "updated-lab-3-power-bi-platform", "sample-powerbi-dashboard"],
  snowflake: ["snowflake-playbook", "lab-4-snowflake", "sample-snowflake-dbt"],
  azure: ["azure-cloud-practice-playbook", "lab-5-azure-cloud", "sample-azure-bicep"],
  qa: ["qa-team-playbook", "lab-6-qa-team", "sample-qa-playwright", "sample-qa-api-tests"],
  ai: ["ai-automation-playbook", "lab-7-ai-automation", "session-7-prompt-library"],
  innovation: ["innovation-center-playbook", "lab-8-innovation-center", "session-8-prompt-library"],
  leadership: ["leadership-managers-playbook", "lab-9-leadership-managers", "session-9-prompt-library"],
};

type Track = { id: PeTrack; label: string; audience: string; objective: string; uses: string[]; example: string; repo: string[]; check: string[]; scenario: string; tasks: string[] };

export const TRACKS: Track[] = [
  {
    id: "saas",
    label: "SaaS Dev",
    audience: "Backend and frontend developers",
    objective: "Use AI for scaffolding, debugging, refactoring, tests and documentation, and know what to review before you commit.",
    uses: ["API scaffolding and business logic", "Bug explanation and root-cause analysis (stack trace plus context)", "Refactoring without changing behaviour", "Unit and integration test generation", "API and code documentation"],
    example: `You are a senior .NET backend engineer.
Generate a REST endpoint: POST a new customer with email validation, duplicate prevention and audit logging.
Context: .NET 8 minimal APIs, SQL Server, multi-tenant (a customer belongs to a tenant).
Constraints: validate email format; 409 Conflict on a duplicate email within the tenant; log successful creation; handle null input.
Format: the endpoint method, then the key decisions.
Evaluation: validates input, prevents duplicates, safe for multi-tenant.`,
    repo: ["API design", "Code generation", "Debugging", "Refactoring", "Test generation", "Code documentation"],
    check: ["Dependency injection and database access", "Error codes and edge cases", "Tenant isolation and security", "Tests actually run and fail when the code is wrong"],
    scenario: "Feature: send secret-expiry reminders to tenant admins 15 days before a secret expires, and validate the new secret automatically when it is updated.",
    tasks: ["Prompt for the API design: endpoints, contracts, validation, audit.", "Prompt for one service method with validation and logging.", "Prompt for unit tests covering positive, negative and security cases; note what the AI missed.", "Prompt for the API documentation and check it against the code."],
  },
  {
    id: "powerbi",
    label: "Power BI and Platform",
    audience: "BI analysts, Power Apps and Power Automate developers",
    objective: "Turn a business need into a data model, DAX measures, app logic and an automation flow, and validate each before it ships.",
    uses: ["DAX measures and time intelligence", "Power Query M transformations", "Data model and report layout", "Power Apps formulas and form validation", "Power Automate approvals, retries and fallbacks"],
    example: `Create a DAX measure for Year-over-Year Sales Growth.
Context: fact table Sales, date table Calendar, some months may be missing.
Constraints: handle missing months gracefully; avoid misleading results.
Output: the DAX, an explanation, and the edge cases.`,
    repo: ["DAX measures", "Power Query M", "Report layout", "Power Apps formulas", "Power Automate flows"],
    check: ["Grain and business definitions of each measure", "Measures tested on edge cases (blank months, filters)", "Flow tested on failure paths", "No real customer data in the prompt"],
    scenario: "Business workflow: a support-ticket trends dashboard, an escalation app and an approval flow for escalations.",
    tasks: ["Propose the data model (tables, grain, relationships).", "Generate 3 DAX measures with edge cases.", "Design the Power Apps screens and the validation formulas.", "Design the approval flow with retries and fallback handling."],
  },
  {
    id: "snowflake",
    label: "Snowflake",
    audience: "Data engineers and SQL developers",
    objective: "Use AI to write, explain, tune and document SQL and dbt models, and validate every optimisation on real data.",
    uses: ["SQL generation with CTEs and null handling", "Explaining and tuning a slow query", "dbt model design and tests", "Pipeline documentation"],
    example: `You are a Snowflake data analyst.
Generate a query for the top 10 customers by annual revenue.
Context: last 12 months, multi-region data, revenue can be null, medium warehouse.
Constraints: readable CTEs, comments, safe null handling.
Format: the SQL, then the logic and assumptions.`,
    repo: ["SQL generation", "Query tuning", "dbt model design", "Data quality tests", "Pipeline documentation"],
    check: ["Result matches a known-good sample", "Query profile compared before and after", "Assumptions about data distribution", "Tests cover nulls, duplicates, late data"],
    scenario: "A slow monthly revenue query with poor documentation needs to be understood, optimised, documented and covered by data-quality tests.",
    tasks: ["Ask the AI to explain the slow query (use a sanitised copy).", "Identify the bottlenecks.", "Write the optimised version and say how you will prove it returns the same result.", "Generate documentation and suggest data-quality tests."],
  },
  {
    id: "azure",
    label: "Azure Cloud Practice",
    audience: "Cloud architects and DevOps engineers",
    objective: "Use AI for architecture options, IaC scaffolds and risk review, keeping every security control human-approved.",
    uses: ["Architecture and service selection with trade-offs", "Bicep and Terraform scaffolding", "Pipeline generation", "Security and compliance review prompts"],
    example: `Recommend an Azure architecture for a multi-tenant SaaS with 10K users.
Context: .NET backend, React frontend, regulated data, high availability.
Constraints: security, scalability, operational simplicity.
Output: the service layout, trade-offs and risks.`,
    repo: ["Architecture design", "IaC generation", "Service comparison", "Security review"],
    check: ["Controls approved by a human, not assumed", "IaC deployed first in a safe subscription", "No secrets or real resource names in the prompt", "Compliance requirements actually stated"],
    scenario: "Secure deployment design for a regulated multi-tenant web app.",
    tasks: ["Propose the architecture.", "Compare two service options for the data tier.", "Generate a Bicep scaffold (parameters, identity, secrets by reference).", "List the deployment stages and the top 5 risks."],
  },
  {
    id: "qa",
    label: "QA",
    audience: "QA engineers and test automation specialists",
    objective: "Go from a requirement to a test plan, test cases, API scenarios and automation outline, and probe for the edge cases the AI misses.",
    uses: ["Test plans with scope, risks and entry/exit criteria", "Positive, negative, boundary and permission test cases", "Playwright/Selenium page objects", "API test scenarios", "Clear defect reports"],
    example: `Generate test cases for a password-reset feature.
Context: multi-tenant SaaS, 2FA required, audit logging.
Constraints: cover positive, negative, boundary, permission and security cases.
Output: test case name, steps, expected result.
Evaluation: includes expired and invalid tokens, concurrent resets and audit-log checks.`,
    repo: ["Test plan creation", "Test case generation", "Automation scripts", "Defect analysis"],
    check: ["What could fail in production that this missed?", "Domain rules the AI could not know", "Automation selectors and waits are real", "Test data is fake"],
    scenario: "From one feature requirement (a login with lockout and password reset) produce a starter test pack.",
    tasks: ["Create the test plan.", "Generate test cases and add the ones the AI missed.", "Write API test scenarios (invalid payloads, auth failures, duplicates).", "Outline the automation, then rewrite a vague defect report clearly."],
  },
  {
    id: "ai",
    label: "AI and Automation",
    audience: "Advanced practitioners and automation builders",
    objective: "Think in workflows: decompose a problem, chain prompts, add evaluation and fallbacks, and keep a human in the loop.",
    uses: ["Problem decomposition into AI-solvable steps", "Prompt chains (classify, extract, recommend, route)", "Rubric-based evaluation and critique prompts", "Confidence thresholds and fallback paths"],
    example: `Design a workflow that:
1. classifies a support request's priority
2. extracts the key information
3. suggests recommended actions
4. routes it to the right team
5. includes a human review checkpoint
Include a fallback for low-confidence classifications.`,
    repo: ["Problem decomposition", "Chaining prompts", "Workflow design", "Evaluation and fallbacks"],
    check: ["Where will this chain fail?", "What does each step receive and return?", "What confidence triggers human review?", "Errors do not propagate silently to the next step"],
    scenario: "Design an AI workflow that triages incoming support requests end to end.",
    tasks: ["Decompose the problem into steps with inputs and outputs.", "Design the prompt chain.", "Add evaluation logic and a confidence threshold.", "Define fallback handling and document the workflow."],
  },
  {
    id: "innovation",
    label: "Innovation Center",
    audience: "Product managers, innovators and researchers",
    objective: "Use AI for breadth: frame problems, generate and compare ideas, scope an MVP and test the assumptions behind it.",
    uses: ["Problem framing", "Idea generation grouped by impact, complexity, novelty", "Assumption mapping", "MVP scoping and a two-week prototype plan", "Pitch creation"],
    example: `Generate 10 solution ideas for improving developer productivity.
Group them by impact, complexity and novelty.
For each: why it matters and what questions remain.`,
    repo: ["Problem framing", "Idea generation", "Assumption mapping", "MVP scoping", "Pitch creation"],
    check: ["Which assumptions are you actually testing?", "MVP boundary is explicit (what is out)", "Claims and numbers checked against real sources", "Ideas are not just the AI's most common answers"],
    scenario: "Take a vague opportunity from your own area from problem statement to a one-minute pitch.",
    tasks: ["Frame the problem.", "Generate options and select a concept.", "Define the MVP scope and the assumptions to test.", "Write a two-week prototype plan and a one-minute pitch."],
  },
  {
    id: "leadership",
    label: "Leadership and Managers",
    audience: "Directors, team leads and managers",
    objective: "Use AI for summaries, options comparison and risk analysis, and guide your team on responsible use.",
    uses: ["One-page summaries of long proposals", "Options comparison with a recommendation", "Risk extraction", "Meeting summaries with decisions and actions"],
    example: `Summarise this proposal for leadership.
Include: strategic value, risks, dependencies, costs, next steps.
Limit to one page.
Recommend proceed or defer, with your reasoning.`,
    repo: ["Executive summary", "Options comparison", "Risk analysis", "Meeting summary"],
    check: ["AI speeds analysis; the decision stays human", "Numbers and claims checked against the source", "Nothing confidential pasted into an unapproved tool", "Where in your team is human review mandatory?"],
    scenario: "Turn a long proposal (use a public or fully anonymised one) into a leadership summary with options and next steps.",
    tasks: ["Write the executive summary prompt and run it.", "Compare two options with criteria and a recommendation.", "Extract the top risks and mitigations.", "Write three rules for responsible AI use in your team."],
  },
];

export const trackLabel = (id: string) => TRACKS.find((t) => t.id === id)?.label ?? id;
export const getTrack = (id: string) => TRACKS.find((t) => t.id === id);

export function trackUnit(t: Track): Unit {
  return {
    id: `l2-${t.id}`,
    level: 2,
    title: `${t.label}: prompting for your work`,
    objective: t.objective,
    blocks: [
      { title: `Who this is for: ${t.audience}`, points: t.uses },
      { title: "Worked example", points: ["Study how each of the six elements is filled in, then adapt it to your own task."], example: t.example },
      { title: "Your playbook, lab workbook and sample project", points: ["The playbook is the full guide for your team. The lab workbook has the long version of the lab below. Sample projects are small files you create and paste, so you can practise on something real."], docs: TRACK_DOCS[t.id] },
      { title: "Prompts from the shared repository", points: [...t.repo.map((r) => `${r}: a tested template.`), "Find them under Prompt repository in the Library."], docs: ["prompt-repository-readme"] },
      { title: "Before you use the output, check", points: t.check },
    ],
    lab: {
      scenario: t.scenario,
      tasks: [...t.tasks, "Put your first attempt in 'Initial prompt', your improved version in 'Refined prompt', and a short summary of the output and your validation notes in the last two boxes."],
      doneWhen: ["The prompt uses most of the six elements with constraints specific to the scenario.", "You refined it at least once based on the output.", "Your validation notes say what a human expert must still verify."],
    },
  };
}

export const ASSESSMENT: Unit = {
  id: "l3",
  level: 3,
  title: "Assessment and adoption",
  objective: "Show the whole skill on a real scenario from your own work, then make it reusable for your team.",
  blocks: [
    {
      title: "Chain, evaluate, fall back",
      points: [
        "Break a large task into stages with a clear input and output for each. One prompt per stage is easier to check than one giant prompt.",
        "Add an evaluation step (a rubric or a critique prompt) between stages so an error does not flow downstream.",
        "Decide the confidence level below which a human reviews, and what happens when a step fails.",
      ],
      example: `Stage 1 classify -> Stage 2 extract -> Stage 3 recommend -> Review gate (human if confidence < threshold) -> Stage 4 draft the response`,
    },
    {
      title: "How the assessment is scored",
      points: [
        "Five dimensions, 5 points each (25 total): prompt clarity, context completeness, constraint quality, output usefulness, validation thinking.",
        "It is open book and tests practical skill, not memorisation. Complete it in one sitting (60 to 90 minutes).",
        "The process: describe a real scenario, write the initial prompt, run it and review the output, refine, write validation notes, submit.",
      ],
    },
    {
      title: "Instructions and workbooks",
      points: ["Read the assessment instructions before you start. The two workbooks cover the assessment lab and the adoption review."],
      docs: ["assessment-instructions", "lab-10-assessment-certification", "lab-11-adoption-review"],
    },
    {
      title: "Adoption: add a prompt to the repository",
      points: [
        "After the assessment, turn your best prompt into a reusable template: what it does, when to use it, the template with [PLACEHOLDERS], an example, and the validation checklist.",
        "Use real work, but anonymise it (no names, secrets or internal identifiers).",
        "Use the prompt on a real task this week and note the time it saved.",
      ],
    },
  ],
  lab: {
    scenario: "Write a 2 to 4 sentence problem statement from your own work (what you must accomplish, why it is hard, what the AI should produce), then complete the assessment on it.",
    tasks: [
      "Scenario: describe your real problem, anonymised.",
      "Initial prompt: the full 6-element prompt.",
      "Run it and summarise the output (3 to 5 bullets).",
      "Refined prompt: improve it based on the gaps you found.",
      "Validation notes: assumptions the AI made, what you would verify manually, what could go wrong.",
    ],
    doneWhen: ["All six elements are present and specific.", "The refined prompt clearly improves on the first.", "Validation notes name concrete risks and checks."],
  },
};

export const allUnits = (): Unit[] => [FOUNDATION, ...TRACKS.map(trackUnit), ASSESSMENT];
export const getUnit = (id: string) => allUnits().find((u) => u.id === id);
export { PE_TRACKS };
