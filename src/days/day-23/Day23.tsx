import LabDay from "@/components/LabDay";

export default function Day23() {
  return (
    <LabDay
      cfg={{
        day: 23,
        objective: "Produce an architecture note and a test strategy for the same module, and prove they cover each other.",
        callout: "The cross-check is the learning objective, not the two documents.",
        concept: [
          "Dev produces the architecture note (components, flow, risks). QA designs a test strategy from that exact note.",
          "Every component in the note must appear in the coverage matrix; risk-based priorities must reflect this module, not a template.",
          "A gap found here would otherwise surface as a production incident.",
        ],
        labs: [
          {
            title: "Lab: the sample note and an incomplete strategy",
            files: [{ path: "ARCHITECTURE.sample.md" }, { path: "TEST_STRATEGY.sample.md" }],
          },
          {
            title: "Lab: Dev writes the note, QA writes the strategy, then cross-check",
            prompt:
              "# Context\n[paste the architecture note for the module]\n# Task\nDesign a test strategy: coverage matrix by component, risk-based\nprioritization, and environment/data requirements.\n# Requirements\nEvery component in the architecture note must appear in the coverage\nmatrix.",
            steps: [
              "Dev: generate the note and list every component under '## Components' (one bold name per bullet).",
              "QA: generate the strategy from the ACTUAL note text, not a summary.",
              "Cross-check: node src/days/day-23/cross-check.js ARCHITECTURE.md TEST_STRATEGY.md",
              "Review the OTHER track's artifact for gaps (peer review).",
            ],
          },
        ],
        assignment: ["One real architecture note or test-strategy doc for a current project"],
        quiz: {},
        facilitator: [
          "The sample strategy forgets Payment Adapter and Notification Worker. Run cross-check.js to show it, then ask how the strategy would have caught the payment-taken-but-no-order risk.",
          "Protect time for the cross-check. A strategy generated from a generic template fails it.",
        ],
      }}
    />
  );
}
