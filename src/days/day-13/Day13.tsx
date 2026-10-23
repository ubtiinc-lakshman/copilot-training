import LabDay from "@/components/LabDay";

export default function Day13() {
  return (
    <LabDay
      cfg={{
        day: 13,
        objective: "Generate unit tests and functional test cases that include the negative and edge cases Copilot skips unless asked.",
        callout: "After the first pass, always ask: what did it skip?",
        concept: [
          "Unit tests from a function; functional and regression cases from a requirement or user story.",
          "The reliable gaps: empty input, boundary values, permission-denied and other negative paths.",
          "Flagship QA day: every QA participant leaves with a working automation script, not just test-case text.",
        ],
        labs: [
          {
            title: "Lab: Dev, unit tests to about 80% coverage",
            files: [{ path: "resetToken.js" }, { path: "resetToken.test.js" }],
            prompt:
              "# Context\nThis function validates a password-reset token (expiry, one-time use).\n# Task\nGenerate unit tests targeting 80% coverage.\n# Requirements\n- Include expired-token and already-used-token cases explicitly\n- Use node:test",
            steps: [
              "Run the prompt, then: node --test --experimental-test-coverage src/days/day-13/resetToken.test.js",
              "Re-prompt for the negative and edge cases if missing.",
              "Report coverage before and after.",
            ],
          },
          {
            title: "Lab: QA, cases to automation script",
            files: [{ path: "USER_STORY.md" }],
            steps: [
              "Generate Given-When-Then cases with priority P0/P1/P2.",
              "Ask what Copilot skipped (empty input, boundaries, permission-denied).",
              "Convert 3 cases into a Playwright, Cypress or Selenium script.",
            ],
          },
        ],
        assignment: ["Tests generated for one real module or feature in your own repo", "Coverage report, before and after"],
        quiz: {},
        facilitator: [
          "Expected gaps on the first pass: the exact TTL boundary (15 minutes passes, 15 minutes + 1 ms fails), issue() with missing arguments, a token redeemed twice.",
          "Make sure every QA participant leaves with a working script. Debrief question: what did Copilot skip on the first pass?",
        ],
      }}
    />
  );
}
