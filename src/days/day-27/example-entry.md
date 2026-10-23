# Playbook entry: Turn a vague bug report into a reproducible one

**Section:** QA
**Use it when:** a bug report says "it sometimes breaks" and you need steps another person can follow.
**Author / date:** Example, Day 27

## The prompt (template)

```
# Context
Bug report from [source]: "[paste the report exactly as written]"
# Task
Rewrite it as a reproducible bug report.
# Requirements
- Numbered steps starting from a clean state
- Expected result and actual result as separate lines
- List what is still unknown as questions, do not guess
# Additional Info
Product: [name and version]. Environment: [browser/OS/build].
```

## Worked example

**Before:** "password reset email never received"

**After:** Context: Bug report from support: "password reset email never received". Product: Order Desk 1.4, Chrome 130, staging.

**What Copilot returned:** steps 1-5 from the login page, expected "email within 1 minute", actual "no email after 10 minutes", and three open questions (spam folder? address typed correctly? which provider?).

## Watch out for
- Copilot may invent steps the reporter never took. Delete any step you cannot trace back to the report.

## Quality check (Day 5 rubric)
- [x] Uses Context / Task / Requirements / Additional Info
- [x] Requirements are specific
- [x] A new hire could use it with no context from me
