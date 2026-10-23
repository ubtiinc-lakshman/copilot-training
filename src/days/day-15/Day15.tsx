import LabDay from "@/components/LabDay";

export default function Day15() {
  return (
    <LabDay
      cfg={{
        day: 15,
        objective: "Refactor with tests as a safety net, or stabilize a flaky test by fixing the real root cause.",
        callout: "A longer sleep is not a fix, even if it passes three times.",
        concept: [
          "Explain first, then write characterization tests of what the code does today, then refactor in the smallest steps you can verify.",
          "Flaky tests usually come from timing, shared state, ordering or an unawaited operation.",
          "Running it several times only counts if the underlying cause is fixed.",
        ],
        labs: [
          {
            title: "Lab: Dev, incremental refactor",
            files: [{ path: "legacy.js" }, { path: "legacy.test.js" }],
            prompt:
              "# Context\nThis 80-line function has no tests and mixes validation, business\nlogic, and logging.\n# Task\nExplain what it does, then propose an incremental refactor plan that\nkeeps behavior identical at each step.",
            steps: ["Fill in the characterization tests first.", "Refactor in small steps, npm test after each.", "Run the final version 3 times: behavior unchanged."],
          },
          {
            title: "Lab: QA, stabilize a flaky test",
            files: [{ path: "flaky.seeded.js" }],
            steps: [
              "Run it 10 times and note the failure rate.",
              "Use Chat to find the real cause (waits, assertions, isolation).",
              "Fix it for real, then confirm 3+ stable runs.",
            ],
          },
        ],
        assignment: ["One real legacy function refactored, or one real flaky test stabilized, in your own codebase"],
        quiz: {},
        facilitator: [
          "Flaky test cause: saveDraft lands after a random 0-30 ms and the test waits a fixed 15 ms (a race), and the two tests share one cache so order matters. Real fix: make saveDraft return a promise and await it, and give each test its own store.",
          "Call out any sleep(5000)-style fix immediately, even if it passes three times in the room.",
          "Legacy function traps: the SAVE25 coupon silently does nothing under 5000, non-US orders get no tax, a fractional qty is rejected.",
        ],
      }}
    />
  );
}
