// Optional app track: participants build ONE Next.js app ("Order Desk") across Days 2-10.
// Separate from the standalone day labs. Seed files live in app-track/seed/.
export type TrackTask = {
  day: number;
  title: string;
  dev: string[];
  qa: string[];
  accept: string[];
  prompt?: string;
  seed?: string[];
  commit: string;
};

export const TRACK_INTRO = [
  "Optional. Do it on your own machine in your own repo, in addition to the standalone lab each day.",
  "You build one Next.js app, Order Desk (products, cart, orders, login), and each day adds to it.",
  "Dev and QA both work in the same app: Dev builds, QA tests. Commit at the end of every day.",
  "Seed files (data, bugs, a login route to audit) are in app-track/seed/ in the training repo. Fake data only.",
];

export const TRACK: TrackTask[] = [
  {
    day: 2,
    title: "Create the app and get the tooling working",
    dev: [
      "Run: npx create-next-app@latest order-desk --ts --app --src-dir --eslint --tailwind --use-npm",
      "Open order-desk in the IDE where Copilot is verified. Run npm run dev and open localhost:3000.",
      "git init, commit as the first commit.",
      "Ask Chat to explain the folder structure in 5 bullets, then compare its answer with the real folders.",
    ],
    qa: [
      "Add Vitest: npm i -D vitest, and add the script \"test\": \"vitest run --passWithNoTests\".",
      "Write a 5-line manual smoke checklist (page loads, no console errors, ...) in docs/smoke.md.",
    ],
    accept: ["npm run dev serves the page", "Git repo with a first commit", "npm test runs without error"],
    prompt: "# Context\nA new Next.js App Router project (TypeScript, src dir).\n# Task\nExplain the folder structure in 5 bullets.\n# Requirements\n- Name what each top-level folder and file is for\n- Say which files I would edit to add a new page",
    commit: "Day 2: scaffold Order Desk",
  },
  {
    day: 3,
    title: "Order logic with inline suggestions",
    dev: [
      "Create src/lib/orders.ts. Write one comment per function and let Copilot suggest: calculateTotal(items), applyDiscount(total, code), isValidEmail(email), formatCurrency(cents).",
      "Accept, reject or edit each suggestion. Log every decision on the Day 3 page.",
    ],
    qa: [
      "Create src/lib/orders.test.ts. Write assertion comments and let Copilot suggest the tests.",
      "Cover empty input, null, zero quantity, unknown discount code, and invalid emails. Check each test can really fail.",
    ],
    accept: ["4 functions implemented", "At least one suggestion edited, not blindly accepted", "npm test passes"],
    prompt: "// Return the order total in cents: the sum of price * quantity for all items.",
    commit: "Day 3: order logic and tests",
  },
  {
    day: 4,
    title: "Chat debugging and triage on seeded bugs",
    dev: [
      "Copy seed/orders.json to src/data/orders.json and seed/day-04/order-route.ts to src/app/api/orders/[id]/route.ts.",
      "Request /api/orders/o-1001 (works) and /api/orders/nope (500). Use /fix with the real error, find the ROOT cause (return a 404 JSON response), verify the happy path.",
      "Then fix the cart bug QA hands you.",
    ],
    qa: [
      "Copy seed/day-04/cart.ts to src/lib/cart.ts and cart.failing.test.ts to src/lib/cart.test.ts. Run npm test: one test fails.",
      "Use /explain with the full output. Real defect, flaky or bad data? Write the diagnosis with evidence. Do NOT fix it.",
    ],
    accept: ["Unknown order id returns 404, known id still 200", "Cart discount applied once (90, not 81)", "QA diagnosis written before the fix"],
    seed: ["seed/orders.json", "seed/day-04/order-route.ts", "seed/day-04/cart.ts", "seed/day-04/cart.failing.test.ts"],
    prompt: "/fix\n[paste the full error or the failing test output]",
    commit: "Day 4: fix order lookup 404 and double discount",
  },
  {
    day: 5,
    title: "Products page built from structured prompts",
    dev: [
      "Copy seed/products.json to src/data/products.json.",
      "Write the prompt in the Context / Task / Requirements / Additional Info template and have Copilot build /products: a list of the 8 products with formatted prices and a stock badge.",
      "Keep a before/after pair for two prompts in docs/prompt-log.md (vague version and rewritten version).",
    ],
    qa: [
      "Write test scenarios for the products page as prompts: zero stock (USB-C Hub), long names, price formatting, empty list.",
      "Turn two scenarios into Vitest tests of the formatting helper.",
    ],
    accept: ["/products shows all 8 products", "Out-of-stock item is clearly marked", "docs/prompt-log.md has 2 before/after prompts"],
    seed: ["seed/products.json"],
    prompt: "# Context\nNext.js 16 App Router, TypeScript, Tailwind. Data in src/data/products.json (price in cents).\n# Task\nBuild a /products page listing every product.\n# Requirements\n- Price shown as $12.99 style\n- Show an 'Out of stock' badge when stock is 0\n- Server component, no client state\n# Additional Info\nNo new dependencies.",
    commit: "Day 5: products page",
  },
  {
    day: 6,
    title: "Document the code and the tests",
    dev: [
      "Ask Copilot for JSDoc on every exported function in src/lib/orders.ts and src/lib/cart.ts.",
      "Check each docstring against the real behavior (intent or reality?). Fix mismatches.",
    ],
    qa: [
      "Ask Copilot for a Given-When-Then description above each test in your test files.",
      "Check each against the assertions and flag any test whose name does not match what it checks.",
    ],
    accept: ["Every exported function has a docstring", "Every test has a description", "At least one mismatch caught and fixed"],
    prompt: "# Context\nsrc/lib/orders.ts has no documentation.\n# Task\nGenerate a JSDoc comment for each exported function.\n# Requirements\n- Describe actual behavior including edge cases and what it throws\n- Keep each under 8 lines",
    commit: "Day 6: document lib and tests",
  },
  {
    day: 7,
    title: "PR description and bug report for a real change",
    dev: [
      "Create a simple src/components/CartSummary.tsx (quantity input and total) and commit it.",
      "Paste seed/day-07/CartSummary.tsx over it. Run git diff and draft the commit message, PR description and README note with Copilot. Link a requirement and list test evidence.",
    ],
    qa: [
      "The complaint: \"Total shows $NaN when I clear the quantity box.\" Reproduce it in the app.",
      "Draft the bug report: observed, expected, exact steps, environment, severity with a reason. Have Copilot critique it for missing information.",
    ],
    accept: ["PR description: what, why, ticket, test evidence", "Bug report steps work on the first try", "Severity is justified"],
    seed: ["seed/day-07/CartSummary.tsx"],
    prompt: "# Context\n[paste git diff]\n# Task\nDraft a commit message and a PR description: what changed, why, how it was tested.\n# Requirements\n- Link the requirement/ticket\n- List test evidence, do not just say 'tested'",
    commit: "Day 7: cart summary change with PR notes",
  },
  {
    day: 8,
    title: "Across languages and frameworks",
    dev: [
      "Copy src/days/day-08/phone-validation.ts from the training repo into src/lib/phone.ts and use it in a signup form phone field.",
      "Rewrite the same validation in a language you do not use daily. Keep identical edge-case behavior. Find one subtle mistake and write docs/day-8-reflection.md: syntax, logic or convention?",
    ],
    qa: [
      "Write an end-to-end login-page test in a framework you do not normally use (Playwright, Cypress or Selenium) against npm run dev.",
      "Find one thing that is non-idiomatic or subtly wrong and record it in the same reflection file.",
    ],
    accept: ["Phone field validates in the signup form", "Reflection names a specific mistake and its type", "E2E test runs against the app"],
    commit: "Day 8: phone validation and cross-framework notes",
  },
  {
    day: 9,
    title: "Security review of a Copilot-generated login route",
    dev: [
      "Copy seed/users.json to src/data/users.json and seed/day-09/login-route.ts to src/app/api/login/route.ts (all credentials fake).",
      "Run the checklist prompt, then fix: move the secret to .env.local (git-ignored), stop logging the password, validate input, replace MD5 with a proper approach (crypto.scrypt or a signed token library).",
    ],
    qa: [
      "For each finding, write a negative test that proves it: missing fields return 400, wrong password returns 401, the response never contains the password.",
      "Confirm nothing sensitive is committed: git log -p shows no secrets.",
    ],
    accept: ["No secret in the repo", "Password is never logged", "Input validated (400 on bad input)", "Negative tests pass"],
    seed: ["seed/users.json", "seed/day-09/login-route.ts"],
    prompt: "# Context\nThis is a Copilot-generated login route.\n# Task\nReview it against our security checklist: hardcoded secrets, missing input validation, weak crypto defaults, PII in logs.\n# Requirements\nList every finding with severity and the line it is on.",
    commit: "Day 9: harden login route",
  },
  {
    day: 10,
    title: "Capstone: ship one real feature (paired)",
    dev: [
      "Pick with your partner: A) order history page with CSV export, or B) coupon codes applied in the cart.",
      "Scaffold with the template prompt, implement, run it once. Work on a capstone/<pair-name> branch.",
    ],
    qa: [
      "In parallel, generate Given-When-Then cases from the requirement and write Vitest tests (plus one E2E check if time).",
      "Run them against the Dev's feature when ready and report failures.",
    ],
    accept: ["Feature works and tests pass", "Both partners can explain the other half", "PR lists what Copilot was used for at each step"],
    prompt: "# Context\nOrder Desk (Next.js 16, TypeScript). Orders in src/data/orders.json.\n# Task\nScaffold the feature end to end.\n# Requirements\n- [functional requirement 1]\n- [functional requirement 2]\n# Additional Info\nNo new dependencies beyond what the app already has.",
    commit: "Day 10: capstone feature",
  },
];

export function getTrackTask(day: number): TrackTask | undefined {
  return TRACK.find((t) => t.day === day);
}
