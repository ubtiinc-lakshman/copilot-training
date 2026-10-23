# Day 30 - Advanced Capstone (Level Gate, Program Certification)

**Joint Dev + QA pair, presenting to leadership and peers | 35 min**

Lead a mock feature-build session end to end using the AI-agent-per-phase model from the AI Enabled Development Guide. Choose a feature slice big enough to exercise planning, implementation and testing.

| Task | Minutes | Do |
|---|---|---|
| 1. Plan | 5 | Break the feature into implementation steps, a test strategy and risk areas. Route to the planning-suited agent (for example Claude Opus). |
| 2. Scaffold (Agent mode) | 5 | Scaffold the feature and, in parallel, its test harness. Checkpoint the agent at least once (graded). |
| 3. Implement and test | 15 | Dev implements. QA builds and runs automated tests live. Where relevant: a Day 24 security check and/or a Day 25 performance check. |
| 4. Review and present | 10 | Copilot-assisted PR-style review, then present: what was built, how it was tested, what Copilot did at each phase. Q&A: leadership probes one design and one testing decision. |

```
# Context
[the chosen feature, its business justification]
# Task
Break this into a plan: implementation steps, test strategy, and risk
areas.
```

## Done when

- All 4 tasks were completed and demonstrated live
- At least one Agent-mode checkpoint intervention is documented
- The AI-usage log is complete and specific (tool/agent + phase), see `AI_USAGE_LOG.template.md`
- Both partners can defend a design decision and a testing decision under Q&A

**Level gate: 80% attendance and 70% average assessment score across Days 21-30.**
Program certification is awarded on passing all three levels (Dev track, QA track, or Dev+QA dual, depending on the lab variants completed).
