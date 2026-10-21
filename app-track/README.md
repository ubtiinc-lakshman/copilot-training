# Optional app track: Order Desk

An optional extra for participants who want to build one real Next.js app alongside the training.
It is separate from the standalone day labs in `src/days/`. Nothing here is required.

- You create the app yourself on Day 2 (`create-next-app`), in your own repo, not in this one.
- Days 2-10 each add a feature. Dev builds, QA tests, both in the same app.
- Tasks, starter prompts and "done when" checklists: the `/track` page of the training site.
- `seed/` holds fake data and the paste-in files (the seeded bugs for Day 4 and Day 7, the login route to audit on Day 9).

## Prerequisites (before Day 2)

- Node.js 22.12 or newer (24 LTS recommended) and npm 10+. Next.js 16 needs 20.9+, Vitest needs 22.12+.
- Git 2.30+ with `user.name` and `user.email` configured.
- IDE with Copilot and Copilot Chat active (verified on Day 2).
- Access to the npm registry (set the proxy if you are behind one: `npm ping` to test).
- A plain working folder, not OneDrive/SharePoint (sync breaks `node_modules`). About 1 GB free per app.
- Day 8 only: Playwright browsers (`npx playwright install`) if you choose Playwright.
- Optional: GitHub CLI (`gh`) or a GitHub repo for the Day 7 and Day 10 pull requests.

Check everything in one go: `node app-track/check-prereqs.mjs`

## The plan

| Day | Adds to the app |
|---|---|
| 2 | Scaffold, git, Vitest |
| 3 | Order logic (total, discount, email, currency) + tests |
| 4 | Order API (404 bug) + cart (double discount bug), diagnosed with Chat |
| 5 | /products page from structured prompts |
| 6 | Docstrings and test descriptions, checked against real behavior |
| 7 | CartSummary change: PR description and a bug report |
| 8 | Phone validation, a rewrite in another language, a cross-framework E2E test |
| 9 | Security review and hardening of the login route |
| 10 | Paired capstone feature |
