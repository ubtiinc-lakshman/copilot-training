# Level 1: Basic - Project Plan (Days 1-10)

Sources: Lab Workbook - Basic, Facilitator Guide - Basic, Assessment Questionnaires (Basic).
Rule for every day: `npm test` stays green. Anything meant to fail is isolated (see "Seeded failures").

## Day-by-day

| Day | Date | Topic | What the project needs (`src/days/day-NN/`) | Showcase page |
|---|---|---|---|---|
| 1 | Wed Oct 21 | Intro to Copilot | **Done.** `order.service.js` (5 TODO stubs), `user.service.js`, tests, LAB.md | Agenda, lab tasks, live order/email panel |
| 2 | Thu Oct 22 | Environment setup & licensing | `utc.js` stub for the model-compare prompt ("one-line UTC timestamp"), `SETUP-CHECKLIST.md` (VS Code / JetBrains / Visual Studio) | Interactive setup checklist (saved in browser), model-dropdown compare table |
| 3 | Fri Oct 23 | Inline suggestions | Dev: `utils.js` (5 comment-driven functions, email regex, one async helper). QA: `test-helpers.js` (assertUserHasRole, assertResponseSchemaValid, status 201 check). Room for off-by-one / null / missing-await misses | Accept / reject / edit tracker (per participant, exportable for the peer review) |
| 4 | Mon Oct 26 | Chat: Ask / Explain / Fix | Dev: `user.service.js` seeded `getUserName` TypeError. QA: seeded failing test + full stack trace file | Slash-command cheat sheet (/explain /fix /tests), stack trace sample, diagnosis write-up template (QA hands off, Dev fixes) |
| 5 | Tue Oct 27 | Prompt fundamentals | `vague-prompts.md` (seed list: "make a login form", "write some tests"), template file | Prompt builder form (Context / Task / Requirements / Additional Info), before/after view, rubric self-score |
| 6 | Wed Oct 28 | Docs & test comments | Dev: `rateLimiter.js` undocumented, with a happy-path-only docstring trap. QA: `rateLimiter.test.js` assertions with no descriptions | Doc-coverage checklist, "intent vs actual behavior" examples |
| 7 | Thu Oct 29 | Non-code artifacts | Dev: `sample.diff` + change description. QA: `test-results.json` (pass/fail) + vague complaint ("password reset email never received") | Commit / PR / bug-report templates, reviewer checklist |
| 8 | Fri Oct 30 | Languages & stacks | Dev: `phone-validation.ts` to rewrite in an unfamiliar language. QA: login scenario spec to automate in an unfamiliar framework | Reflection template (syntax vs logic vs convention mismatch) |
| 9 | Mon Nov 2 | Ethics, licensing, security | `seeded/01-05` Copilot outputs (clean, hardcoded **fake** secret, weak hash, PII in logs, license concern). Answer key kept separate (facilitator only) | Security checklist, 10-question test with scoring (hard gate: 70%) |
| 10 | Tue Nov 3 | Basic capstone (level gate) | `capstone/` starter: 2 feature options (CSV email validator CLI, password strength checker), PR template with Copilot-usage notes | 25-point rubric scorer, pair sheet, level-gate tracker (80% attendance, 70% average) |

Dates follow the Oct 21 start (30 weekdays, no holiday in the window).

## Cross-cutting (build once, reuse all 10 days)

1. `DayLayout` and shared pieces: `CodeBlock`, `ChecklistTracker`, `Quiz` (single answer, T/F, short answer).
2. Facilitator mode (`?facilitator=1`, off by default): shows answer keys and demo scripts, hides them from participants.
3. Assessment data per day in `assessment.ts`: Day 1 (5 Q), Day 9 (10 Q), others from the Basic questionnaires.
4. Each day folder keeps a `LAB.md` that matches the lab workbook, so the repo works without the website.
5. Test scripts: `npm test` (green), `npm run test:seeded` (the intentionally failing Day 4 test).

## Seeded failures

Intentional bugs and failing tests live in files named `*.seeded.js` and are excluded from `npm test`. They run only through `npm run test:seeded`, so CI and the normal test run stay green.

## Build order (each day ready the day before its session)

| Ready by | Day |
|---|---|
| Wed Oct 21 | 2 |
| Thu Oct 22 | 3 |
| Fri Oct 23 | 4, then 5 |
| Mon Oct 26 | 6 |
| Tue Oct 27 | 7 |
| Wed Oct 28 | 8 |
| Thu Oct 29 | 9 (seeded outputs + quiz are the biggest piece) |
| Fri Oct 30 | 10 |

Before Day 9: a full review pass on `seeded/` (no real secrets, no real PII, answer key not reachable without facilitator mode).

## Risks

- **Answer keys on a deployed site:** facilitator mode is a convenience, not security. Do not deploy the site publicly with keys, or keep keys out of the build.
- **Seeded secrets:** Day 9 values must be obviously fake (`FAKE-...`) so secret scanners and reviewers are not misled.
- **Live Copilot variance:** suggestions differ per person, so labs check judgment (read, edit, explain), not an exact output.
- **Day 10 pairing:** pairs (1 Dev + 1 QA) are assigned before Nov 3; each pair works on its own `capstone/<pair>` branch.
