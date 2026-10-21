# Day 4 Lab - Copilot Chat Basics (Ask / Explain / Fix)

**Level 1: Basic | Individual, then pair | 20 min | Dev and QA variants**

Run `npm run test:seeded` to see the seeded failures (they are excluded from `npm test`).

## Dev: explain and fix a bug (20 min)

File: `user.service.js`, test: `user.service.seeded.js`.

1. Select the code, run `/fix` with the real stack trace (`TypeError: Cannot read properties of undefined (reading 'name')`).
2. Read Copilot's explanation of the ROOT cause, not just the symptom.
3. Apply the fix. Verify the happy path still works.

## QA: explain a failing test (20 min)

File: `cart.service.js`, test: `cart.seeded.js`, trace: `STACKTRACE.txt`.

1. Run `/explain` with the full trace. Ask: real defect, flaky test, or bad test data? What evidence points that way?
2. Do NOT fix it. Write the diagnosis for a Dev to act on.

## Assignment

Use Chat to diagnose one real bug or failing test in your own project. Record the exact prompt and the outcome.

## Assessment: walkthrough review

Root cause identified, not symptom-patched. Dev: fix verified against the happy path. QA: diagnosis has evidence and no fix.
