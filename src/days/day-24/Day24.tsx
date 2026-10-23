import LabDay from "@/components/LabDay";

export default function Day24() {
  return (
    <LabDay
      cfg={{
        day: 24,
        objective: "Find real security findings in AI-generated code against an OWASP-style checklist, and prove each with a negative test.",
        callout: "A finding without a proving test is just an opinion.",
        concept: [
          "Copilot can produce code that works and is insecure. Audit it against a checklist rather than by feel.",
          "The Dev reports findings with severity and exact line; the QA writes a negative test that demonstrates each risk.",
          "Copilot reviewing its own output is not independent. Compare its self-review with the human findings and name the gap.",
        ],
        labs: [
          {
            title: "Lab: the seeded module and the checklist (all values are FAKE)",
            files: [{ path: "seeded/auth-module.js" }, { path: "SECURITY_CHECKLIST.md" }, { path: "negative.test.js" }],
          },
          {
            title: "Lab: Dev audits, QA proves, then the self-review comparison",
            prompt:
              "# Context\n[paste the seeded authentication module]\n# Task\nAudit against an OWASP-style checklist: input validation, secrets\nhandling, crypto defaults, injection risk.\n# Requirements\nList each finding with severity and the exact line.",
            steps: [
              "Dev: audit and list findings with severity and line.",
              "QA: write a negative test per finding (negative.test.js has the first one).",
              "Both: have Copilot review its own output against the same checklist, then name what it missed.",
            ],
          },
        ],
        assignment: ["The checklist run against one real recent Copilot-assisted change"],
        quiz: {},
        facilitator: [
          "Seeded findings: SQL built by string concatenation (login and resetPassword), MD5 unsalted password hash, hardcoded secrets (JWT and admin password), password written to the log, forgeable base64 token containing the secret, loose == comparison, no input validation, no rate limit.",
          "Compare Copilot's self-review to the human findings out loud with the whole cohort. The gap is the point.",
        ],
      }}
    />
  );
}
