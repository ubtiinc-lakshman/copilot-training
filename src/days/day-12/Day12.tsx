import LabDay from "@/components/LabDay";

export default function Day12() {
  return (
    <LabDay
      cfg={{
        day: 12,
        objective: "Fix real bugs (Dev) or classify failures with evidence (QA), not guesswork.",
        callout: "A guess is not a triage. Name the evidence.",
        concept: [
          "Debugging with Chat: reproduce, bisect the root cause, verify the fix does not regress the happy path.",
          "QA angle: separate a real defect from a flaky test or bad test data, and write the evidence behind the call.",
          "Evidence looks like: shared state, timing, ordering, an invalid fixture, a deterministic wrong result.",
        ],
        labs: [
          {
            title: "Lab: Dev, fix 3 seeded bugs",
            files: [{ path: "bugs.js" }],
            steps: ["Reproduce each bug (npm run test:seeded).", "Use Chat to find the ROOT cause.", "Fix each and confirm npm test still passes."],
          },
          {
            title: "Lab: QA, triage 3 failing tests",
            files: [{ path: "triage.seeded.js" }],
            prompt:
              "# Test\n[paste the failing test]\n# Failure pattern\n[e.g. fails 1 in 5 runs, always after the login suite]\n# Task\nIdentify the likely cause (timing, shared state, external dependency)\nand propose a fix.",
            steps: ["Run the diagnosis prompt on each test.", "Classify: real defect / flaky test / bad test data.", "Write the specific evidence. Do not fix the code."],
          },
        ],
        assignment: ["Fix one real bug or triage one real failing test in your own project", "Keep the Copilot-assisted reasoning log"],
        quiz: {},
        facilitator: [
          "Dev bugs: paginate treats pages as 0-based (start = page * size, should be (page - 1) * size). applyCoupon multiplies by the raw percent (10) instead of percent / 100. stockFor does not trim or upper-case the SKU.",
          "QA TRIAGE-1: real defect, deterministic (0.1 * 3 is 0.30000000000000004; money should be integer cents). TRIAGE-2: flaky, random 0-20 ms delay against a 10 ms limit. TRIAGE-3: bad test data, 2026-13-45 is not a real date.",
          "Push QA past 'probably flaky' to the specific evidence. Reveal the key at the debrief.",
        ],
      }}
    />
  );
}
