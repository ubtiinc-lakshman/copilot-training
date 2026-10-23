import LabDay from "@/components/LabDay";

export default function Day18() {
  return (
    <LabDay
      cfg={{
        day: 18,
        objective: "Generate an API test collection that matches the contract a Dev just scaffolded, and prove it by cross-checking.",
        callout: "Generate the tests from the real contract text, not a generic example.",
        concept: [
          "Paired work: the Dev scaffolds the contract and client code, the QA generates the collection from that exact contract.",
          "The cross-check compares the collection with the contract field by field: names, required fields, status codes.",
          "A mismatch caught here is exactly the kind that ships to production otherwise.",
        ],
        labs: [
          {
            title: "Lab: Dev scaffolds, QA generates (paired)",
            files: [{ path: "contract.json" }],
            prompt:
              "# Context\nNew endpoint: create an order.\n# Task\nScaffold an API contract/schema and boilerplate client code.\n# Requirements\n- POST /api/orders\n- Request: items array + shipping address\n- Response: 201 with orderId and status",
          },
          {
            title: "Lab: QA test collection, then cross-check",
            files: [{ path: "collection.sample.json", label: "collection.sample.json (what a generic example gets wrong)" }],
            prompt:
              "# API Contract\n[paste the Dev partner's ACTUAL contract]\n# Task\nGenerate a test collection covering happy path, auth failure, and\nschema-validation errors.",
            steps: [
              "Compare the collection with the real contract field by field.",
              "Fix each mismatch together (wrong field name, missing required field, wrong status code).",
              "Optional: run crosscheck.js to see the mismatches mechanically.",
            ],
          },
        ],
        assignment: ["One real API endpoint scaffolded or test-scripted in your own project"],
        quiz: {},
        facilitator: [
          "Pair Dev and QA explicitly. The sample collection plants the usual mismatches: products instead of items, address instead of shippingAddress, status 200 instead of 201, message instead of error.",
          "Debrief: ask each pair which mismatch they found. That is usually the aha of the day.",
        ],
      }}
    />
  );
}
