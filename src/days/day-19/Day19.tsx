import LabDay from "@/components/LabDay";

export default function Day19() {
  return (
    <LabDay
      cfg={{
        day: 19,
        objective: "Catch and correct a Copilot suggestion that quietly violates the team's style guide on a shared codebase.",
        callout: "Copilot does not know your style guide unless you tell it.",
        concept: [
          "On a shared repo, style drift compounds: small inconsistencies multiply as more people build on top.",
          "Check every suggestion against the guide, not just for correctness.",
          "Day 22's custom instructions file is the fix; today you feel the problem first.",
        ],
        labs: [
          {
            title: "Lab: make a style-conformant change",
            files: [{ path: "STYLE_GUIDE.md" }, { path: "shared/inventory.js" }, { path: "draft-change.sample.txt", label: "draft-change.sample.txt (what drift looks like)" }],
            steps: [
              "Make a small change with Copilot, for example removeItem(inventory, sku) plus a test.",
              "Check every suggestion against the style guide.",
              "Find and name at least one violated rule, then fix it. node src/days/day-19/check-style.js checks rules 1-3.",
            ],
          },
        ],
        checklist: {
          id: "day-19-style",
          title: "Style check",
          items: [
            "No console.log in app code",
            "No var",
            "Test titles start with 'should'",
            "Function names are camelCase verbs",
            "Money is integer cents in a variable ending in Cents",
          ],
        },
        assignment: ["One real style-conformant change in a shared / cross-team repo"],
        quiz: {},
        facilitator: [
          "Treat style drift as seriously as a correctness bug. The sample draft breaks rules 1, 2 and 3 at once.",
          "Check participants named the rule they caught, not just fixed it silently.",
        ],
      }}
    />
  );
}
