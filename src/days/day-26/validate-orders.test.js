const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateRows } = require("./validate-orders");
const sample = require("./sample-rows.json");

test("should accept rows that satisfy the schema", () => {
  assert.deepEqual(validateRows(sample.slice(0, 2)), []);
});

test("should catch each planted problem in the sample rows", () => {
  const problems = validateRows(sample).join("\n");
  assert.match(problems, /row 3: status "delivered"/);
  assert.match(problems, /row 4: user_id is NOT NULL/);
  assert.match(problems, /row 5: total_cents/);
  assert.match(problems, /row 6: created_at/);
  assert.match(problems, /row 7: duplicate id 6/);
});

test("should flag what looks like a real email address", () => {
  const row = { id: 1, user_id: 1, status: "pending", total_cents: 1, created_at: "2026-10-01", note: "asha.k@gmail.com" };
  assert.match(validateRows([row]).join("\n"), /real email/);
});
