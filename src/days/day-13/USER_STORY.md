# Day 13 (QA): user story

As a user, I can reset my password via an emailed link.

Acceptance notes (use them, do not invent others):
- The link carries a one-time token that is valid for 15 minutes.
- Using the link twice, or after 15 minutes, shows an error and offers to send a new link.
- A new password must be at least 12 characters.
- A locked account cannot reset until it is unlocked.

```
# User Story
As a user, I can reset my password via an emailed link.
# Task
Generate test cases covering happy path, edge cases, and negative/permission-denied
paths, in Given-When-Then format, with priority (P0/P1/P2).
```

Then ask: "What did you skip?" (empty input, boundary values, permission-denied). Convert 3 cases into a Playwright / Cypress / Selenium script.
