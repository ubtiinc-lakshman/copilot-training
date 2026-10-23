import LabDay from "@/components/LabDay";

export default function Day22() {
  return (
    <LabDay
      cfg={{
        day: 22,
        objective: "Write a .github/copilot-instructions.md that measurably changes suggestion behavior.",
        callout: "Every rule must be checkable against a live suggestion.",
        concept: [
          "A repo-level instructions file tells Copilot your conventions so it stops drifting (the Day 19 problem).",
          "Short and sharp beats long and vague. A rule you cannot check on one suggestion does not belong.",
          "Proof is a before and after suggestion side by side.",
        ],
        labs: [
          {
            title: "Lab: a good file and the rules that do not belong",
            files: [{ path: "copilot-instructions.example.md" }, { path: "vague-rules.md" }],
            prompt:
              "# Context\nTeam repo conventions: error handling always via Result<T>, no\nconsole.log in production code, tests use Jest with the\n\"describe/it\" style, API responses always camelCase.\n# Task\nDraft a .github/copilot-instructions.md capturing these conventions\nfor both app code and test code.",
            steps: [
              "Draft the file with your team's real conventions (Dev and QA both contribute).",
              "Get a suggestion before the file is committed, then after, and compare.",
              "Remove any rule you cannot test. node src/days/day-22/check-instructions.js <file> flags the vague ones.",
            ],
          },
        ],
        checklist: {
          id: "day-22-instructions",
          title: "Instruction-file review",
          items: [
            "Covers app-code conventions",
            "Covers test-code conventions",
            "A fresh suggestion visibly respects the rules after the file is in place",
            "Every rule is checkable (no 'write good code')",
          ],
        },
        assignment: ["The instructions file committed to a real team repo, or proposed via PR"],
        quiz: {},
        facilitator: [
          "Push back on any rule that cannot be tested against a live suggestion. Use vague-rules.md as the warm-up: rewrite each one into a checkable rule.",
          "Ask for the before/after suggestion side by side. Without it, the file is unproven.",
        ],
      }}
    />
  );
}
