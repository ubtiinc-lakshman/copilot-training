# Day 24 Lab - Security Review of AI-Generated Code

**Level 3: Advanced | PAIRED Dev + QA | 20 min**

Seeded module: `seeded/auth-module.js` (all values are FAKE). Checklist: `SECURITY_CHECKLIST.md`. Proof tests: `negative.test.js`.

## Dev: audit and fix (10 min)

```
# Context
[paste the seeded authentication module]
# Task
Audit against an OWASP-style checklist: input validation, secrets
handling, crypto defaults, injection risk.
# Requirements
List each finding with severity and the exact line.
```

## QA: prove each finding (10 min)

```
# Context
Finding: [one specific finding from the Dev partner's audit]
# Task
Write a negative test that demonstrates this finding's risk.
```

## Self-review comparison (remaining time)

1. Have Copilot review its own earlier output against the same checklist.
2. Compare its self-assessment with the human findings. What did it miss about its own work?

## Assignment

The checklist run against one real recent Copilot-assisted change.

## Assessment: security findings report, jointly reviewed by the pair. Every finding has a proving negative test.
