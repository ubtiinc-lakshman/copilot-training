# Day 21 Lab - Copilot Agent Mode: End-to-End Features & Test Frameworks

**Level 3: Advanced | Individual | 20 min | Dev and QA variants**

Supervise Agent mode through a multi-step task and interrupt it at least once. Base code: `app/` (conventions in `CONVENTIONS.md`). Log in `AGENT_LOG.md`.

## Dev: scaffold a feature (20 min)

```
# Context
New feature: users can export their order history as a CSV.
# Task
Scaffold this end-to-end: API endpoint, service function, and a route
wired into the existing orders module.
# Requirements
- Stop and show me the plan before writing any files
- Flag any existing convention you're not sure applies here
```

1. Run the prompt and review the plan before letting the agent proceed.
2. Interrupt at least once mid-task with a correction.
3. Review every file the agent touched.

## QA: scaffold a test framework (20 min)

```
# Context
New project area with no test infrastructure yet.
# Task
Scaffold a full test framework/harness: folder structure, config, and
base test classes, matching our existing [framework] conventions.
# Requirements
- Stop and show me the plan before writing any files
```

## Assignment

One real, bounded Agent-mode task in your own repo, with a log of every checkpoint you intervened on.

## Assessment: scaffold review with a lead. Did the human catch what needed catching?
