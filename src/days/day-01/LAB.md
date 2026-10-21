# Day 1 Lab - Intro to GitHub Copilot & AI Pair Programming

**Level 1: Basic | Format: Individual | Lab time: 20 minutes | Dev + QA, same task**

Goal: get a first inline suggestion and a first Chat answer, and practice **rejecting** a suggestion on purpose.

> **Copilot suggests, you decide.**

## Setup (2 min)

1. Open this folder in your IDE: `D:\UBTI_IP\Copilot_Training`
2. Confirm Copilot and Copilot Chat are active (status icon, no red X).
3. Optional: run `npm test` (Node 18+). All existing tests should pass.

## Task 1 - Accept / Reject practice (10 min)

- **Dev:** open `src/order.service.js`. Five `// TODO` comments sit above empty functions.
- **QA:** open `tests/order.service.test.js`. Three `// TODO` comments describe assertions to write.

Steps:

1. Put the cursor on the line under a TODO comment and wait for the grey ghost-text suggestion.
2. **Read the whole suggestion before pressing Tab.**
3. Accept 3 suggestions and reject 2 (Esc). For each rejection, write down why.
4. Note your most confident rejection for the debrief.

Things to check in each suggestion: empty or null input, rounding, wrong threshold (500 means 500 or more), off-by-one.

## Task 2 - First Chat summary (10 min)

Open Copilot Chat and run (Dev: point it at `src/`, QA: at `tests/`):

```
# Context
This practice repo (Dev: the service modules in src/, QA: the test suite in tests/).
# Task
Summarize what this codebase does in 3 sentences.
```

Then compare the summary to the real code. If it missed or invented something, write your own 3-sentence version.

## Assignment (due before Day 2)

1. One screenshot of an accepted inline suggestion.
2. One screenshot of a Chat response.
3. Post both to the shared Day-1 channel.

## Assessment: 5-question concept quiz

- Can you state what Copilot is and is not, in your own words?
- Did you name at least one suggestion you rejected and why?
- Did you check the Chat summary against the actual code?

## Facilitator demo script (10 min)

1. Type `// Return the order total after applying a discount code` above a new function in `src/order.service.js`. Read the suggestion aloud, then accept or reject it.
2. Ask Chat: *What does this codebase do? Give me a 3-sentence summary of its purpose and main components.* Check the answer against `src/`.
3. Say out loud: "I'm not sure this handles an empty order. Let me check."
