import LabDay from "@/components/LabDay";

export default function Day16() {
  return (
    <LabDay
      cfg={{
        day: 16,
        objective: "Draft a PR description and respond usefully to reviewer comments, for app code and test code alike.",
        callout: "A response that sounds responsive but fixes nothing is worse than no response.",
        concept: [
          "A good PR description says what changed, why (linked requirement) and how it was tested (explicit evidence).",
          "Copilot drafts quickly, but you decide whether a suggested reply resolves the reviewer's actual concern.",
          "Test-code PRs deserve the same rigor as app-code PRs.",
        ],
        labs: [
          {
            title: "Lab: the diff and the two seeded comments",
            files: [{ path: "sample.diff" }, { path: "review-comments.md" }, { path: "PR_TEMPLATE.md" }],
            prompt:
              "# Context\n[paste the diff]\n# Task\nDraft a PR description: what changed, why, and how it was tested.\n# Requirements\n- Link the requirement/ticket\n- List test evidence explicitly, don't just say \"tested\"",
            steps: [
              "Draft the PR description (Dev: app code, QA: the test-code half of the diff).",
              "Respond to the 2 seeded review comments with Copilot's help.",
              "Evaluate: does each reply resolve the concern, or only sound responsive?",
            ],
          },
        ],
        checklist: {
          id: "day-16-pr",
          title: "PR-quality checklist",
          items: [
            "The description links the requirement or ticket",
            "Test evidence is listed explicitly (commands, results, cases), not just 'tested'",
            "Each comment reply addresses the actual concern raised",
            "The reply names the change made or the decision taken",
          ],
        },
        assignment: ["One real PR, opened or updated, using Copilot for the description and at least one comment response"],
        quiz: {},
        facilitator: [
          "Comment 1 asks who decided to round; a good reply names the rounding rule and where it is documented, or changes the code. Comment 2 asks for real test() wrappers; a good reply makes the change and shows per-case output.",
          "Ask participants to justify why a reply resolves the concern. Challenge 'good catch, fixed'.",
        ],
      }}
    />
  );
}
