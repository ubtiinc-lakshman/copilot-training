const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { check } = require("./check-style");

test("should accept the shared module as written", () => {
  for (const f of ["inventory.js", "inventory.test.js"]) {
    const src = fs.readFileSync(path.join(__dirname, "shared", f), "utf8");
    assert.deepEqual(check(src, { isTest: f.endsWith(".test.js") }), []);
  }
});

test("should flag the unconfigured-Copilot draft", () => {
  const issues = check(fs.readFileSync(path.join(__dirname, "draft-change.sample.txt"), "utf8"), { isTest: true });
  assert.equal(issues.length, 3);
});
