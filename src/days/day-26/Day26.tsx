import LabDay from "@/components/LabDay";

export default function Day26() {
  return (
    <LabDay
      cfg={{
        day: 26,
        objective: "Generate synthetic test data and prove it satisfies the schema, not just that it looks realistic.",
        callout: "Run the validation. Realistic and valid are different claims.",
        concept: [
          "Dev: write or optimize a query or reporting script against a schema, and have Copilot explain it back as a sanity check.",
          "QA: generate synthetic rows plus a validation that actually runs against the schema constraints.",
          "No real PII, ever. Mask or fake anything that resembles real customer data.",
        ],
        labs: [
          {
            title: "Lab: the schema, the validator, and rows with planted problems",
            files: [{ path: "schema.sql" }, { path: "validate-orders.js" }, { path: "sample-rows.json" }],
          },
          {
            title: "Lab: QA generates 50 rows and validates them",
            prompt:
              "# Context\nSchema: orders(id, user_id, status ENUM('pending','shipped','cancelled'),\ntotal_cents INT NOT NULL, created_at TIMESTAMP)\n# Task\nGenerate 50 rows of realistic synthetic test data satisfying this\nschema, with no real PII, plus a validation query confirming every row\nmatches the constraints.",
            steps: ["Generate the data and the validation.", "Run: node src/days/day-26/validate-orders.js your-rows.json", "Fix every row that fails."],
          },
        ],
        assignment: ["One real query/script or one real test-data set for a current project"],
        quiz: {},
        facilitator: [
          "sample-rows.json plants: an invalid status (delivered), a NULL user_id, a negative total, an impossible date (Feb 31), and a duplicate id. The validator reports all five.",
          "Insist the validation actually runs. Check no row contains a real-looking email address.",
        ],
      }}
    />
  );
}
