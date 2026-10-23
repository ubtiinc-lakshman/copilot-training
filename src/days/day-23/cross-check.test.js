const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { components, missingFromMatrix } = require("./cross-check");

const read = (f) => fs.readFileSync(path.join(__dirname, f), "utf8");

test("should list the seven components in the architecture note", () => {
  assert.equal(components(read("ARCHITECTURE.sample.md")).length, 7);
});

test("should find the components the sample strategy forgot", () => {
  assert.deepEqual(missingFromMatrix(read("ARCHITECTURE.sample.md"), read("TEST_STRATEGY.sample.md")), ["Payment Adapter", "Notification Worker"]);
});
