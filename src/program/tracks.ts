// Team-specific tracks (the "Updated Syllabus" for Director approval). Additive: nothing imports this yet.
// Same shape as the weekly program: dated sessions come later from calendar.ts; this file holds the content.
// Each track is delegated to one team: `delegate` is the person who agrees project tasks and attends the demo.
export type TrackModule = { title: string; topics: string[] };

export type TrackSession = {
  id: string; // e.g. "dev-1"; use as the activity id when wired to `completions`
  day: number; // 1-3 workshop, 4-5 hands-on
  title: string;
  modules: number[]; // indexes into Track.modules covered this day
  objective: string;
  lab: string;
  doneWhen: string[];
};

export type Track = {
  id: string;
  name: string;
  audience: string;
  dailyWork: string;
  delegate: string; // nominated by the team; "TBC" until named
  modules: TrackModule[];
  sessions: TrackSession[];
  capstone: string;
  project: string;
  reuse: string;
  build: string;
};

export type CommonDay = { day: number; title: string; topics: string[]; source: string };

export const COMMON: CommonDay[] = [
  { day: 0, title: "Concepts and terminology", topics: ["Git/GitHub: repository, branch, commit, pull request, merge, review", "Build, debug, log, unit and regression test", "Inline, Chat, Ask, Edit, Agent; file, workspace and repository context", "Goal + Context + Constraints + Expected output", "Hallucination, secrets, licensing, prompt injection, human validation"], source: "New" },
  { day: 1, title: "Copilot fundamentals", topics: ["AI pair programming and IDE integration", "Inline suggestions and Chat", "Ask, Explain, Fix, Generate, Review", "Benefits, limitations, human validation"], source: "New; weekly s01" },
  { day: 2, title: "Prompt and context engineering", topics: ["Prompt structure and iteration", "Prompt chaining", "File, workspace and repository context", "Reusable prompts; avoiding ambiguity"], source: "Reuse: Prompt Engineering program" },
  { day: 3, title: "Copilot for day-to-day engineering work", topics: ["Understanding existing artifacts", "Documentation, user stories, acceptance criteria", "Test scenarios and debugging", "Explaining code, queries and data"], source: "Reuse: weekly s05-s06, library" },
  { day: 4, title: "Security, privacy and responsible use", topics: ["Sensitive data and secrets", "Licensing and IP; content exclusion; organization policy", "Vulnerable generated code; secure prompting", "Human accountability"], source: "Partly reuse; policy content new" },
  { day: 5, title: "Advanced Copilot and agentic working", topics: ["Agent Mode: plan, execute, validate", "Custom instructions, prompt files, repository instructions", "Model Context Protocol awareness", "Approval, rollback and recovery"], source: "Reuse: weekly s07, s08, s11" },
  { day: 6, title: "Guided hands-on", topics: ["One common business problem", "Each team produces a role-specific output"], source: "New" },
  { day: 7, title: "Common level gate", topics: ["Practical assessment: prompting, context, feature choice, validation, security"], source: "New; uses the site quiz engine" },
];

export const TRACKS: Track[] = [
  {
    id: "dev",
    name: "Application Development",
    audience: ".NET, Java, Angular, React, full-stack, cloud and application developers",
    dailyWork: "Reading an unfamiliar codebase, turning a user story into a design, writing a feature and its API, fixing a bug, writing unit tests, opening a pull request.",
    delegate: "TBC",
    modules: [
      { title: "Requirements to architecture", topics: ["User-story decomposition", "Acceptance criteria and technical design", "High- and low-level design", "Existing-codebase exploration", "Dependency and impact analysis"] },
      { title: "Copilot-assisted development", topics: ["Multi-file code generation", "API, DTO and validation", "Integration and SQL", "Error handling and documentation"] },
      { title: "Debugging and modernization", topics: ["Root-cause analysis", "Legacy-code understanding", "Behavior-preserving refactoring", "Performance optimization"] },
      { title: "Engineering quality", topics: ["Unit tests with boundary and negative cases", "Pull requests and code review", "Security review", "Technical documentation"] },
      { title: "Agentic development", topics: ["Agent Mode", "Repository instructions and prompt files", "Plan, build, test, fix, review", "Human approval, rollback and recovery"] },
    ],
    sessions: [
      { id: "dev-1", day: 1, title: "From story to feature", modules: [0, 1], objective: "Turn a user story into a design and a working multi-file feature with an API.", lab: "Take a sanitized story from your backlog. Have Copilot split it, write acceptance criteria and a design note, then generate the feature, DTOs and validation.", doneWhen: ["Design note and acceptance criteria written", "Feature and API endpoint run", "You can explain every generated file"] },
      { id: "dev-2", day: 2, title: "Fix, refactor, review", modules: [2, 3], objective: "Debug, refactor safely, test, and take a change through pull request and review.", lab: "Reproduce a seeded bug in legacy code, find the root cause with Copilot, refactor without changing behavior, add boundary and negative unit tests, open a PR and respond to Copilot review.", doneWhen: ["Root cause stated", "Tests pass before and after refactor", "PR opened with review comments handled"] },
      { id: "dev-3", day: 3, title: "Agentic development", modules: [4], objective: "Supervise Agent Mode with repository instructions and approval points.", lab: "Write repository instructions and one prompt file. Use Agent Mode to plan, build, test and fix a small change, approving each step. Practice a rollback.", doneWhen: ["Instructions file committed", "Agent change reviewed file by file", "Rollback done once"] },
      { id: "dev-4", day: 4, title: "Capstone build", modules: [0, 1, 2], objective: "Build the capstone feature from requirement to API.", lab: "Requirement > architecture > feature > API on a realistic task from your team.", doneWhen: ["Design agreed with facilitator", "Feature and API working"] },
      { id: "dev-5", day: 5, title: "Capstone finish", modules: [3, 4], objective: "Finish with tests, security review and a pull request.", lab: "Unit tests > security review > pull request. Self-check against the rubric.", doneWhen: ["Tests pass", "Security checklist completed", "PR ready for review"] },
    ],
    capstone: "Requirement > Architecture > Feature > API > Unit tests > Security review > Pull request",
    project: "One real backlog item per participant or pair, agreed with the team lead.",
    reuse: "Weekly sessions on debugging, tests, Agent mode, MCP, custom instructions, PR review and security review; library Days 11-29.",
    build: "Cross-stack (.NET/Java/Angular) examples, design-assistance exercises, PR and security-review labs inside Copilot.",
  },
  {
    id: "qa",
    name: "QA",
    audience: "Functional QA, automation QA, API testing and quality engineering teams",
    dailyWork: "Reviewing requirements for gaps, writing test cases, building automation and API tests, analysing logs and defects, reporting quality status.",
    delegate: "TBC",
    modules: [
      { title: "Requirement and test analysis", topics: ["Ambiguity analysis", "Acceptance-criteria review", "Functional, negative and boundary scenarios", "Risk-based testing", "Requirement-to-test traceability"] },
      { title: "Test automation", topics: ["Automation-code generation", "Understanding existing scripts", "API test generation", "Assertions, mocks and stubs", "Privacy-safe test data"] },
      { title: "Defect engineering", topics: ["Defect reproduction", "Log and error analysis", "Root-cause hypotheses", "Fix verification", "Regression impact"] },
      { title: "Advanced QA", topics: ["Flaky-test stabilization", "Performance and load-test scripting", "Security-test scenarios", "Synthetic test data", "Validating AI-generated tests"] },
      { title: "Agentic QA", topics: ["Requirement-to-test workflow", "Generate, execute, analyse, refine", "Approval checkpoints", "Evidence and traceability", "Automated quality summary"] },
    ],
    sessions: [
      { id: "qa-1", day: 1, title: "Requirements to tests and automation", modules: [0, 1], objective: "Find gaps in a requirement and turn it into test cases and automated tests.", lab: "Review a sample requirement for ambiguity, produce scenarios with a traceability table, then generate API tests with assertions and safe test data.", doneWhen: ["Ambiguities listed", "Traceability table complete", "API tests run"] },
      { id: "qa-2", day: 2, title: "Defects, flaky tests and validation", modules: [2, 3], objective: "Analyse defects and logs, stabilize flaky tests and check AI-generated tests.", lab: "Reproduce a seeded defect from logs, form root-cause hypotheses, fix and verify. Stabilize a flaky test. Review a Copilot-written test for weak assertions.", doneWhen: ["Root cause stated with evidence", "Flaky test stable over repeated runs", "Weak assertions found and fixed"] },
      { id: "qa-3", day: 3, title: "Agentic QA", modules: [4], objective: "Run a supervised generate-execute-analyse-refine cycle with evidence.", lab: "Use Agent Mode to generate tests from a requirement, run them, analyse failures and refine, approving each step. Produce a short quality summary.", doneWhen: ["Each step approved by you", "Evidence saved", "Quality summary written"] },
      { id: "qa-4", day: 4, title: "Capstone build", modules: [0, 1], objective: "Build the strategy, cases and automation for the capstone.", lab: "Requirement > test strategy > test cases > automation/API tests on a realistic feature of your team.", doneWhen: ["Strategy and cases reviewed", "Automation runs"] },
      { id: "qa-5", day: 5, title: "Capstone finish", modules: [2, 3, 4], objective: "Finish with defect analysis and a test report.", lab: "Defect analysis > test report. Self-check against the rubric.", doneWhen: ["Defects analysed", "Test report complete with traceability"] },
    ],
    capstone: "Requirement > Test strategy > Test cases > Automation/API tests > Defect analysis > Test report",
    project: "One real feature or release of the team's product: strategy, cases, automation and a report.",
    reuse: "Weekly test and debugging sessions; library Days 12 (bugs and triage), 15 (flaky tests), 24-25; Prompt Engineering Session 6.",
    build: "Traceability, defect and log analysis, agentic QA and test-report labs; QA sample application and defect set.",
  },
  {
    id: "powerbi",
    name: "Power BI",
    audience: "Power BI analysts, report developers, semantic-model developers and BI practitioners",
    dailyWork: "Clarifying a business question, shaping data in Power Query, designing the model, writing and debugging DAX, documenting reports.",
    delegate: "TBC",
    modules: [
      { title: "Requirement and data analysis", topics: ["Business-question analysis", "KPI and metric definitions", "Source-data understanding", "Data profiling and SQL assistance"] },
      { title: "Power Query", topics: ["M generation and explanation", "Cleaning and transformation", "Troubleshooting", "Query optimization", "Validating generated transformations"] },
      { title: "Data modeling", topics: ["Star-schema design", "Facts and dimensions", "Relationships and filter behavior", "Semantic-model review and documentation"] },
      { title: "DAX with AI assistance", topics: ["Generate and explain measures", "Debug measures", "Filter context and time intelligence", "Performance improvement", "Validate against hand-calculated examples"] },
      { title: "Report quality", topics: ["Business narrative and visual selection", "Accessibility", "Performance analysis", "Data dictionary", "Governance and sensitive-data review"] },
    ],
    sessions: [
      { id: "powerbi-1", day: 1, title: "Question to clean data", modules: [0, 1], objective: "Define the metrics for a business question and prepare the data with Power Query.", lab: "Write KPI definitions, profile a sample dataset, then generate and validate Power Query steps to clean it.", doneWhen: ["KPI definitions written", "Query output checked against source rows"] },
      { id: "powerbi-2", day: 2, title: "Model and DAX", modules: [2, 3], objective: "Design a star schema and write DAX you can prove correct.", lab: "Propose facts, dimensions and relationships, then generate time-intelligence measures and verify each against a hand-calculated example and an edge case.", doneWhen: ["Model reviewed", "Every measure matches a manual calculation"] },
      { id: "powerbi-3", day: 3, title: "Report quality and documentation", modules: [4], objective: "Make the report understandable, accessible, fast and documented.", lab: "Choose visuals for the narrative, check accessibility and performance, and generate a data dictionary. Check for sensitive data.", doneWhen: ["Accessibility checked", "Data dictionary written", "Sensitive-data review done"] },
      { id: "powerbi-4", day: 4, title: "Capstone build", modules: [0, 1, 2], objective: "Build the data and model for the capstone.", lab: "Business question > data > model on a realistic team scenario.", doneWhen: ["Model loads and refreshes", "Relationships reviewed"] },
      { id: "powerbi-5", day: 5, title: "Capstone finish", modules: [3, 4], objective: "Finish measures, report, validation and documentation.", lab: "DAX > report > validation > documentation. Self-check against the rubric.", doneWhen: ["Measures validated", "Report and documentation complete"] },
    ],
    capstone: "Business question > Data > Model > DAX > Report > Validation > Documentation",
    project: "One real report or model improvement from the team's backlog, using non-sensitive or masked data.",
    reuse: "Prompt Engineering Session 3 (Power BI); the prompt formula, validation and anonymization material.",
    build: "Power Query/M, star-schema and report-quality content; Copilot inside the Power BI authoring workflow. Almost entirely new.",
  },
  {
    id: "fabric",
    name: "Fabric and Data Engineering",
    audience: "Fabric engineers, data engineers, SQL developers and notebook/pipeline developers",
    dailyWork: "Mapping sources to targets, writing SQL and PySpark, building pipelines, checking data quality, troubleshooting failures, writing runbooks.",
    delegate: "TBC",
    modules: [
      { title: "Data architecture", topics: ["Source-to-target mapping", "Lakehouse vs warehouse", "Medallion architecture", "Ingestion design", "Security and access"] },
      { title: "Development", topics: ["SQL generation and optimization", "Python and PySpark", "Notebook development", "Transformation logic", "Schema handling"] },
      { title: "Pipelines", topics: ["Pipeline design and development", "Error handling and retry", "Incremental processing", "Schema evolution", "Failure troubleshooting"] },
      { title: "Data quality", topics: ["Data-quality rules", "Validation and reconciliation queries", "Pipeline tests", "Test-data generation", "Failure diagnosis"] },
      { title: "Production readiness", topics: ["Logging and observability", "Performance optimization", "Runbooks and documentation", "Privacy and security", "Deployment and release validation"] },
    ],
    sessions: [
      { id: "fabric-1", day: 1, title: "Architecture and transformations", modules: [0, 1], objective: "Map a source to a target and write the transformation code with Copilot.", lab: "Draft a source-to-target mapping and medallion layout, then generate and optimize SQL and PySpark for one transformation in a notebook.", doneWhen: ["Mapping agreed", "Transformation runs on sample data"] },
      { id: "fabric-2", day: 2, title: "Pipelines and data quality", modules: [2, 3], objective: "Build a resilient pipeline and the checks that prove the data is right.", lab: "Design a pipeline with retry and incremental load, then generate quality rules and reconciliation queries. Diagnose a seeded failure.", doneWhen: ["Pipeline handles a forced failure", "Reconciliation queries pass"] },
      { id: "fabric-3", day: 3, title: "Production readiness", modules: [4], objective: "Prepare a pipeline for handover.", lab: "Add logging, write a runbook, review privacy and access, and draft a release validation checklist.", doneWhen: ["Runbook written", "Access and privacy reviewed"] },
      { id: "fabric-4", day: 4, title: "Capstone build", modules: [0, 1, 2], objective: "Build source to lakehouse or warehouse.", lab: "Source > pipeline > lakehouse/warehouse > transformation on a realistic team scenario.", doneWhen: ["Pipeline loads data end to end"] },
      { id: "fabric-5", day: 5, title: "Capstone finish", modules: [3, 4], objective: "Finish quality checks and consumer output.", lab: "Quality checks > consumer output. Self-check against the rubric.", doneWhen: ["Quality checks pass", "Consumer output verified"] },
    ],
    capstone: "Source > Pipeline > Lakehouse/Warehouse > Transformation > Quality checks > Consumer output",
    project: "One real pipeline, notebook or query improvement from the team, on non-sensitive or masked data.",
    reuse: "Prompt Engineering Session 4 (Snowflake) for SQL prompting; library lessons on tests and security.",
    build: "Fabric, PySpark, lakehouse and medallion content is not present today. New build; needs a Fabric environment.",
  },
  {
    id: "ai",
    name: "AI Team",
    audience: "AI application developers, solution architects and advanced engineering practitioners",
    dailyWork: "Designing prompts and context, building grounded features and agents, evaluating quality, hardening for production.",
    delegate: "TBC",
    modules: [
      { title: "Advanced prompt and context engineering", topics: ["Structured prompting and outputs", "Prompt chaining", "Context management", "Instruction hierarchy", "Evaluation criteria and prompt regression"] },
      { title: "Grounded AI applications", topics: ["Grounding and retrieval patterns", "Knowledge-source selection", "Citation and traceability", "Hallucination reduction", "Context-quality controls"] },
      { title: "Agentic applications", topics: ["Agents and tools", "Model Context Protocol", "Custom agents", "Handoffs and multi-agent patterns", "State and context management"] },
      { title: "AI evaluation", topics: ["Correctness and groundedness", "Evaluation datasets and test cases", "Quality gates", "Regression evaluation", "Failure analysis"] },
      { title: "AI safety and production readiness", topics: ["Prompt injection", "Guardrails and permissions", "Sensitive-data controls", "Human-in-the-loop", "Observability, fallback and governance"] },
    ],
    sessions: [
      { id: "ai-1", day: 1, title: "Prompts and grounding", modules: [0, 1], objective: "Design structured prompts and ground answers in a knowledge source with citations.", lab: "Build a structured prompt chain, then add retrieval from a small document set with citations. Measure hallucinations before and after.", doneWhen: ["Answers cite their source", "Hallucination count compared"] },
      { id: "ai-2", day: 2, title: "Agents and evaluation", modules: [2, 3], objective: "Build an agent with tools and prove its quality with an evaluation set.", lab: "Create an agent with one MCP tool, then write an evaluation dataset and a pass/fail quality gate. Run a regression after a prompt change.", doneWhen: ["Agent calls the tool", "Quality gate runs", "Regression result recorded"] },
      { id: "ai-3", day: 3, title: "Safety and production", modules: [4], objective: "Defend the feature against injection and prepare it for production.", lab: "Attack your own feature with a prompt-injection set, add guardrails and permissions, and define observability and fallback.", doneWhen: ["Injection tests documented", "Guardrails block them", "Fallback defined"] },
      { id: "ai-4", day: 4, title: "Capstone build", modules: [0, 1, 2], objective: "Build the grounded feature or agent.", lab: "Use case > grounding > AI feature/agent > tools.", doneWhen: ["Feature works on the use case"] },
      { id: "ai-5", day: 5, title: "Capstone finish", modules: [3, 4], objective: "Finish evaluation and guardrails, then demonstrate.", lab: "Evaluation > guardrails > demonstration. Self-check against the rubric.", doneWhen: ["Evaluation passes the gate", "Guardrails tested"] },
    ],
    capstone: "Use case > Grounding > AI feature/agent > Tools > Evaluation > Guardrails > Demonstration",
    project: "One real AI feature or agent improvement from the team's backlog, on non-sensitive data.",
    reuse: "Weekly Agent mode, MCP and AI-feature sessions and security review; Prompt Engineering Session 7.",
    build: "Retrieval/RAG, evaluation, custom agents and prompt-injection guardrails content.",
  },
];
