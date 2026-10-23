import LabDay from "@/components/LabDay";

export default function Day28() {
  return (
    <LabDay
      cfg={{
        day: 28,
        objective: "Draft an adoption metrics view that resists being gamed by a shallow proxy metric.",
        callout: "Activity is not outcome. Pair every activity metric with a quality check.",
        concept: [
          "Activity metrics (suggestions accepted, active users) show use. Outcome metrics (cycle time, escaped defects, coverage) show value.",
          "Any metric that is easy to raise without improving quality can be gamed.",
          "Governance: use of AI is logged by tool and phase, and no real secrets or PII go into prompts.",
        ],
        labs: [
          {
            title: "Lab: draft the outline",
            files: [{ path: "METRICS_OUTLINE.template.md" }],
            steps: [
              "Draft a lightweight adoption / ROI outline for your own team.",
              "Find one metric in your draft that could be gamed.",
              "Propose a guardrail for it.",
            ],
          },
        ],
        checklist: {
          id: "day-28-metrics",
          title: "Metrics-framework check",
          items: [
            "At least one outcome metric, not only activity metrics",
            "A named metric that could be gamed",
            "A specific guardrail for it",
            "A review cadence and the decision it feeds",
          ],
        },
        assignment: ["Your team's draft metrics outline"],
        quiz: {},
        facilitator: [
          "'Suggestions accepted' without a quality check is the single most common gameable metric. Check every group caught it, not only the ones that picked it.",
          "A good guardrail pairs it with rework: how much accepted code is changed or reverted soon after.",
        ],
      }}
    />
  );
}
