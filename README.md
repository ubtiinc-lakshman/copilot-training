# GitHub Copilot Training - Practice Repo

Shared practice repo for the GitHub Copilot Training Program (Developers & QA track).
Schedule: Oct 21 - Dec 1, 2026 (30 sessions). Materials live in the IC - Training SharePoint folders.

## Layout

| Path | Used for |
|---|---|
| `src/order.service.js` | Dev practice: inline suggestions (TODO stubs) |
| `src/user.service.js` | Chat practice (seeded bug used on Day 4) |
| `tests/order.service.test.js` | QA practice: test assertions from comments |
| `DAY-01/LAB.md` | Day 1 lab instructions, assignment, facilitator demo script |

## Run

```
npm test
```

Uses the built-in Node test runner (Node 18+), no dependencies to install.

## Ground rules (from Day 1)

- Never paste secrets, credentials, customer PII or proprietary algorithms into a prompt.
- Every suggestion is read and judged by a human before it is kept.
