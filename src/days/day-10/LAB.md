# Day 10 - Basic Capstone (Level Gate)

**Level 1: Basic | Paired: 1 Dev + 1 QA (pre-assigned) | 35 min | No new content**

Pick one option in `capstone/`: A) CSV email validator CLI, B) password strength checker. Work on a `capstone/<pair-name>` branch.

## Dev (20 min)
Scaffold with the template, implement, run it once manually. Use inline suggestions and Chat (Days 3-4).

```
# Context
Building a small CLI tool: [feature description]
# Task
Scaffold the implementation.
# Requirements
- [functional requirement 1]
- [functional requirement 2]
# Additional Info
[language/runtime, no external dependencies]
```

## QA (in parallel, 20 min)
Generate test cases from the REQUIREMENT (do not wait for finished code). Run them once the feature is ready; report failures to your Dev partner.

```
# Context
[paste the Dev's in-progress feature, or the requirement it implements]
# Task
Generate test cases and/or test scripts covering the happy path and at least one edge case.
# Requirements
- Given-When-Then format for test cases
- Runnable test code if the stack supports it
```

## Mutual walkthrough (5 min)
QA explains what the feature does reading only the code. Dev explains what is tested reading only the tests. Flag any surprise.

## Deliverable
One small PR (see `PR_TEMPLATE.md`) with feature + tests and both partners' Copilot-usage notes.

## Assessment: working demo + code/test walkthrough, 25-point rubric
Level gate: 80% attendance and 70% average assessment score across Days 1-10.
