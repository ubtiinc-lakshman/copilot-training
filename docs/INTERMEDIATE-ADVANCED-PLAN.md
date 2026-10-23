# Levels 2 and 3: Intermediate and Advanced (Days 11-30)

Sources: Lab Workbooks (Intermediate, Advanced), Facilitator Guides, and the Level 2 / Level 3 answer questionnaires. Same rules as the Basic plan: `npm test` stays green; anything meant to fail lives in `*.seeded.js` (run by `npm run test:seeded`).

Pages are built from data with `src/components/LabDay.tsx` (objective, concept, lab files, checklist, assignment, quiz, facilitator notes). Days 20 and 30 are custom (rubric scorer and level gate, no quiz).

## Intermediate (Days 11-20)

| Day | Date | Topic | Lab files (`src/days/day-NN/`) |
|---|---|---|---|
| 11 | Nov 4 | Chained prompts | `chain-template.md` |
| 12 | Nov 5 | Debugging, review, defect triage | `bugs.js` + `bugs.test.js` (guards) + `bugs.seeded.js` (3 bugs), `triage.seeded.js` (real defect / flaky / bad data) |
| 13 | Nov 6 | Test generation (core QA) | `resetToken.js` + stub tests, `USER_STORY.md` |
| 14 | Nov 9 | Multi-file context | `orders/` (boolean to enum change across 4 files + test) |
| 15 | Nov 10 | Refactor legacy, flaky tests | `legacy.js` + `legacy.test.js` (baseline), `flaky.seeded.js` |
| 16 | Nov 11 | PR and review workflows | `sample.diff`, `review-comments.md`, `PR_TEMPLATE.md` |
| 17 | Nov 12 | IDE customization | `keybindings.sample.json`, `snippets.sample.json` |
| 18 | Nov 13 | APIs and integration (core QA) | `contract.json`, `collection.sample.json`, `crosscheck.js` + test |
| 19 | Nov 16 | Shared codebases | `STYLE_GUIDE.md`, `shared/`, `check-style.js` + test |
| 20 | Nov 17 | Capstone (level gate) | `CAPSTONE.md`, `RETRO_TEMPLATE.md`, 25-point rubric, gate |

## Advanced (Days 21-30)

| Day | Date | Topic | Lab files |
|---|---|---|---|
| 21 | Nov 18 | Agent mode | `app/` (orders + routes + tests), `CONVENTIONS.md`, `AGENT_LOG.md` |
| 22 | Nov 19 | Custom instructions | `copilot-instructions.example.md`, `vague-rules.md`, `check-instructions.js` + test |
| 23 | Nov 20 | Architecture and test strategy | `ARCHITECTURE.sample.md`, `TEST_STRATEGY.sample.md`, `cross-check.js` + test |
| 24 | Nov 23 | Security review of AI code | `seeded/auth-module.js` (fake secrets), `SECURITY_CHECKLIST.md`, `negative.test.js` |
| 25 | Nov 24 | Performance and load tests | `ordersEndpoint.js`, `bench.js`, `ordersEndpoint.test.js`, `k6-orders.js` |
| 26 | Nov 25 | Data workflows, test data | `schema.sql`, `validate-orders.js` + test, `sample-rows.json` |
| 27 | Nov 26 | Prompt libraries, playbooks | `PLAYBOOK_ENTRY.template.md`, `example-entry.md` |
| 28 | Nov 27 | Governance and metrics | `METRICS_OUTLINE.template.md` |
| 29 | Nov 30 | Train-the-trainer | `MINI_LESSON.template.md` |
| 30 | Dec 1 | Capstone (level gate, certification) | `CAPSTONE.md`, `AI_USAGE_LOG.template.md`, rubric, gate |

## Quiz data

Quizzes for Days 11-19 and 21-29 come from the questionnaires' concept checks and answer keys. They live in the database, not in the repo: edit `data/quizzes.json` (git-ignored) and run `npx vercel env run -e production -- node scripts/seed-quizzes.mjs`.
