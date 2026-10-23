const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { vagueRules } = require("./check-instructions");

const read = (f) => fs.readFileSync(path.join(__dirname, f), "utf8");

test("should find no vague rules in the example file", () => {
  assert.deepEqual(vagueRules(read("copilot-instructions.example.md")), []);
});

test("should flag every rule in the vague list", () => {
  assert.equal(vagueRules(read("vague-rules.md")).length, 5);
});
