import LabDay from "@/components/LabDay";

export default function Day21() {
  return (
    <LabDay
      cfg={{
        day: 21,
        objective: "Supervise Agent mode through a multi-step task, interrupting and correcting it at least once.",
        callout: "The skill is supervision, not delegation. A zero-intervention run is a miss.",
        concept: [
          "Agent mode plans and edits several files on its own. Ask it to show the plan first, and hold it to your conventions.",
          "Interrupting mid-task is a skill to practice deliberately, not a fallback for when things go wrong.",
          "The agent never merges its own output. A human reviews every file it touched.",
        ],
        labs: [
          {
            title: "Lab: the base code and the conventions the agent must follow",
            files: [{ path: "CONVENTIONS.md" }, { path: "app/orders.js" }, { path: "app/routes.js" }],
          },
          {
            title: "Lab: Dev scaffolds a feature, QA scaffolds a test framework",
            prompt:
              "# Context\nNew feature: users can export their order history as a CSV.\n# Task\nScaffold this end-to-end: API endpoint, service function, and a route\nwired into the existing orders module.\n# Requirements\n- Stop and show me the plan before writing any files\n- Flag any existing convention you're not sure applies here",
            steps: [
              "Review the plan before letting the agent proceed.",
              "Interrupt at least once mid-task with a correction.",
              "Review every file the agent touched. Keep npm test green.",
              "Fill in AGENT_LOG.md as you go.",
            ],
          },
        ],
        checklist: {
          id: "day-21-supervision",
          title: "Supervision check",
          items: [
            "I saw the plan before any file was written",
            "I intervened at least once (and logged why)",
            "I read every file the agent touched",
            "I checked the agent followed CONVENTIONS.md (Result shape, 401/404, no new dependency)",
            "I did not let the agent merge its own output",
          ],
        },
        assignment: ["One real, bounded Agent-mode task in your own repo", "A log of every checkpoint you intervened on"],
        quiz: {},
        facilitator: [
          "Common agent slips to look for: throwing instead of returning { ok: false }, a 500 where the convention is 404, camelCase error codes instead of snake_case, adding a CSV library.",
          "Flag a zero-intervention run. Debrief: what did the agent get wrong that a first-glance review would have missed?",
        ],
      }}
    />
  );
}
