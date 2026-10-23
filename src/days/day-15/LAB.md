# Day 15 Lab - Refactoring Legacy Code & Stabilizing Flaky Test Suites

**Level 2: Intermediate | Individual | 20 min | Dev and QA variants**

## Dev: incremental refactor (20 min)

File: `legacy.js` (no tests, no docs). Safety net: `legacy.test.js`.

```
# Context
This 80-line function has no tests and mixes validation, business
logic, and logging.
# Task
Explain what it does, then propose an incremental refactor plan that
keeps behavior identical at each step.
```

1. Get the explanation and the plan; fill in the characterization tests first.
2. Refactor in small steps, running `npm test` after each.
3. Run the final version 3 times to confirm behavior is unchanged.

## QA: stabilize a flaky test (20 min)

File: `flaky.seeded.js`. Run: `node --test src/days/day-15/flaky.seeded.js` several times.

1. Use Chat to diagnose the real root cause.
2. Apply a real fix (not a longer `sleep`).
3. Run it 3+ times to confirm it is stable.

## Assignment

Refactor one real legacy function, or stabilize one real flaky test, in your own codebase.

## Assessment: before/after diff review (Dev) / flake-rate before-after review (QA)
