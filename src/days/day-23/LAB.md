# Day 23 Lab - Architecture & Test-Strategy Design

**Level 3: Advanced | Individual, then peer cross-check | 20 min | Dev and QA variants**

Use one module from a current or recent project (chosen by the cohort). Samples: `ARCHITECTURE.sample.md`, `TEST_STRATEGY.sample.md`.

## Dev: architecture note (20 min)

1. Generate architecture notes / a diagram for the module (Phase 2 of the AI Enabled Development Guide).
2. List every component named in the diagram under a "## Components" heading, one bold name per bullet.

## QA: test strategy (20 min)

```
# Context
[paste the architecture note for the module]
# Task
Design a test strategy: coverage matrix by component, risk-based
prioritization, and environment/data requirements.
# Requirements
Every component in the architecture note must appear in the coverage
matrix.
```

1. Generate the strategy from the ACTUAL architecture note text, not a summary.
2. Cross-check: does every component appear in the matrix? `node src/days/day-23/cross-check.js ARCHITECTURE.md TEST_STRATEGY.md`

The cross-check is the learning objective, not the two documents on their own.

## Assignment

One real architecture note or test-strategy doc for a current project.

## Assessment: peer review. Reviewers check the OTHER track's artifact for gaps.
