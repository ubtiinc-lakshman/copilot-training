import LabDay from "@/components/LabDay";

export default function Day14() {
  return (
    <LabDay
      cfg={{
        day: 14,
        objective: "Complete a change that touches several files consistently, using workspace context deliberately.",
        callout: "@workspace is a search-and-scope tool, not a fix-it-all button. Verify its file list.",
        concept: [
          "@workspace searches the repo for the files a change touches; its list can miss files.",
          "Context matters: open and relevant files improve suggestions, closing them lowers quality.",
          "Consistency across files matters more than speed on a contract change.",
        ],
        labs: [
          {
            title: "Lab: the contract change (files in src/days/day-14/orders)",
            intro: "The status field moves from a boolean (shipped) to the enum pending / shipped / cancelled.",
            files: [
              { path: "orders/service.js" },
              { path: "orders/api.js" },
              { path: "orders/report.js" },
              { path: "orders/badge.js" },
              { path: "orders/orders.test.js" },
            ],
          },
          {
            title: "Steps",
            prompt:
              "@workspace\nThis API contract changed: the \"status\" field is now an enum, not a\nboolean. Find every file that reads or writes this field and list what\nneeds to change.",
            steps: [
              "Dev: implement the change in every flagged file.",
              "QA: update every assertion on the old boolean, consistently across test files.",
              "Close the relevant files on purpose, re-run a related suggestion, and note the quality drop.",
            ],
          },
        ],
        assignment: ["One real cross-file change (feature or test-suite update) in your own repo"],
        quiz: {},
        facilitator: [
          "Files to find: service.js, api.js (both directions), report.js, badge.js, and the test. A list with 3 of 5 is the common miss.",
          "The close-files exercise is about instinct: check what is open before trusting a suggestion.",
        ],
      }}
    />
  );
}
