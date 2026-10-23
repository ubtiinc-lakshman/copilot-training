# Prompt chain template (copy, fill the [BRACKETS], reuse)

Rule: step N+1 pastes the ACTUAL output of step N. Never retype or summarize it from memory.

## Dev: Plan -> Scaffold -> Test

```
1) # Context: [new feature, 1-2 sentences]
   # Task: outline the implementation plan in 4 steps
2) # Context: [paste plan step 2 exactly as Copilot returned it]
   # Task: scaffold the function signature and file structure for this step
3) # Context: [paste the scaffolded function exactly as returned]
   # Task: generate unit tests covering the happy path and one edge case
   # Requirements: use [test framework]
```

## QA: Requirement -> Cases -> Automation

```
1) # Context: [paste the requirement / user story]
   # Task: list the test scenarios this requirement implies
2) # Context: [paste the scenario list exactly as returned]
   # Task: write full test cases in Given-When-Then for the top 3 scenarios
3) # Context: [paste ONE test case exactly as returned]
   # Task: generate the automation script for it ([Playwright | Cypress | Selenium])
```

## Chain check (answer before you present it)

- Does step 2 break if I delete step 1's output? (It should.)
- Could a teammate fill in the [BRACKETS] without asking me anything?
