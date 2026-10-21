# Day 7 Lab - Copilot for Non-Code Artifacts

**Level 1: Basic | Individual | 20 min | Dev and QA variants**

## Dev: commit message, PR description, README section (20 min)

Input: `sample.diff`.

```
# Context
[paste the diff]
# Task
Draft a commit message, PR description, and README section for this change.
# Requirements
- Link the requirement/ticket
- List test evidence explicitly
```

Then ask Copilot to critique your draft for missing information. Revise.

## QA: bug report and test-run summary (20 min)

Input: `test-results.json` (8 results, one failing, and a one-line complaint).

```
# Observed
Password reset email is never received for some users.
# Expected
Every valid reset request receives the email within 2 minutes.
# Steps to Reproduce
1. Request reset for a user with a Gmail address created via SSO
2. Wait 5 minutes
# Task
Draft a bug report with severity, environment, and suspected component.
```

Also draft a test-run summary from the results. Have Copilot critique both for missing information.

## Assignment

One real PR description or bug report drafted with Copilot's help.

## Assessment: reviewer checklist (clarity / accuracy / completeness)

Could a reviewer act with no follow-up question? Do repro steps work on the first try? Is severity justified, not just asserted?
