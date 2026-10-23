# Day 13 Lab - Test Generation with Copilot (core QA day)

**Level 2: Intermediate | Individual | 20 min | Dev and QA variants**

## Dev: unit tests, ~80% coverage

File: `resetToken.js`; stub tests in `resetToken.test.js`.

```
# Context
This function validates a password-reset token (expiry, one-time use).
# Task
Generate unit tests targeting 80% coverage.
# Requirements
- Include expired-token and already-used-token cases explicitly
- Use node:test
```

1. Run the prompt, check coverage: `node --test --experimental-test-coverage src/days/day-13/resetToken.test.js`
2. Re-prompt for the negative / edge cases if they are missing.
3. Report coverage before and after.

## QA: cases -> automation script

Use `USER_STORY.md`. Generate Given-When-Then cases (P0/P1/P2), ask what was skipped, then convert 3 cases to an automation script.

## Assignment

Tests for one real module / feature in your own repo, with a coverage report before and after.

## Assessment: coverage report review (Dev) / test-case quality + automation script review (QA)
