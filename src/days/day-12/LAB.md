# Day 12 Lab - Copilot Chat for Debugging, Code Review & Defect Triage

**Level 2: Intermediate | Individual | 20 min | Dev and QA variants**

## Dev: fix 3 seeded bugs (20 min)

File: `bugs.js`. Failing checks: `npm run test:seeded` (only `bugs.seeded.js` matters to you). Guards: `npm test`.

1. Reproduce each bug.
2. Use Chat to bisect the ROOT cause (not the symptom).
3. Apply and verify each fix without breaking the happy path.

## QA: triage 3 failing tests (20 min)

File: `triage.seeded.js`. Do not fix the code.

```
# Test
[paste the failing test]
# Failure pattern
[e.g. fails 1 in 5 runs, always after the login suite]
# Task
Identify the likely cause (timing, shared state, external dependency)
and propose a fix.
```

Classify each: real defect / flaky test / bad test data. Write the specific evidence ("probably flaky" is not a classification).

## Assignment

Fix one real bug or triage one real failing test in your own project. Keep the Copilot-assisted reasoning log.

## Assessment: bug-fix / triage accuracy against the seeded answer key
