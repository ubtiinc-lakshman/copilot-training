import LabDay from "@/components/LabDay";

export default function Day27() {
  return (
    <LabDay
      cfg={{
        day: 27,
        objective: "Contribute a playbook entry a teammate could reuse with zero follow-up questions.",
        callout: "An entry without a worked example is not done.",
        concept: [
          "A playbook is a library of proven prompts, each with its template, a before/after example and a watch-out.",
          "Write for a new hire with zero context from you.",
          "Judge entries against the Day 5 prompt-quality rubric, and file them in the Dev or QA section.",
        ],
        labs: [
          {
            title: "Lab: the template and a finished example",
            files: [{ path: "PLAYBOOK_ENTRY.template.md" }, { path: "example-entry.md" }],
            steps: [
              "Pick your strongest prompt from Days 1-26.",
              "Turn it into a template with [BRACKETS] and a worked before/after example.",
              "Swap with a partner and improve theirs against the rubric.",
            ],
          },
        ],
        checklist: {
          id: "day-27-entry",
          title: "Entry check (Day 5 rubric)",
          items: [
            "Uses Context / Task / Requirements / Additional Info",
            "Requirements are specific (no 'good' or 'better')",
            "Has a worked before/after example from real work",
            "Filed in the correct Dev or QA section",
            "A new hire could use it with no context from me",
          ],
        },
        assignment: ["A finalized playbook entry with a real before/after example from your own work"],
        quiz: {},
        facilitator: [
          "Send back any entry that is only the bare template. The worked example separates a playbook from a prompt dump.",
          "Collect the best Dev and QA entries from Days 11 and 27 into the team playbook.",
        ],
      }}
    />
  );
}
