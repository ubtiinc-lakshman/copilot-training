# Day 6 Lab - Copilot for Docs & Code/Test Comments

**Level 1: Basic | Individual | 20 min | Dev and QA variants**

## Dev: docstrings (20 min)

File: `rateLimiter.js` (it already has a docstring: judge it).

```
# Context
This is an undocumented Node.js middleware function for rate limiting.
# Task
Generate a JSDoc comment explaining parameters, return value, and rate-limit behavior.
# Requirements
- Include an example of when it throws
- Keep it under 8 lines
```

Check the generated docstring against the code: intent or reality? Compare with the existing docstring. Fix any mismatch.

## QA: Given-When-Then descriptions (20 min)

File: `rateLimiter.test.js` (tests are called "test 1".."test 5").

```
# Context
This test file has no descriptions, only assertions.
# Task
Generate a Given-When-Then description above each test case.
# Requirements
- Match the description exactly to what the assertions actually check
- Flag any test whose name doesn't match its assertions
```

## Assignment

Document one real module or test file in your own repo with Copilot-generated, human-reviewed comments.

## Assessment: documentation-coverage check (accuracy spot-checked)
