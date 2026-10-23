# Day 22 Lab - Custom Instructions & Repo-Level Context Tuning

**Level 3: Advanced | Paired or group, Dev and QA write it jointly | 20 min**

Write a `.github/copilot-instructions.md` that measurably changes suggestion behavior. Reference: `copilot-instructions.example.md`. Anti-examples: `vague-rules.md`.

```
# Context
Team repo conventions: error handling always via Result<T>, no
console.log in production code, tests use Jest with the
"describe/it" style, API responses always camelCase.
# Task
Draft a .github/copilot-instructions.md capturing these conventions
for both app code and test code.
```

1. Draft the file with your team's real conventions (Dev and QA both contribute rules).
2. Get a suggestion BEFORE the file is committed, then AFTER. Compare side by side.
3. Remove any rule you cannot test against a live suggestion. `node src/days/day-22/check-instructions.js <your file>` flags the vague ones.

## Assignment

The instructions file committed to a real team repo, or proposed via PR.

## Assessment: instruction-file review. Completeness and testability of each rule.
