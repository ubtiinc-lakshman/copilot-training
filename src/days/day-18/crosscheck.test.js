const { test } = require("node:test");
const assert = require("node:assert/strict");
const { crossCheck } = require("./crosscheck");
const contract = require("./contract.json");
const collection = require("./collection.sample.json");

test("the generic sample collection has the expected mismatches with the real contract", () => {
  const issues = crossCheck(contract, collection);
  assert.ok(issues.some((i) => i.includes('missing required field "items"')), "wrong field name: products vs items");
  assert.ok(issues.some((i) => i.includes("expects status 200")), "wrong status code");
  assert.ok(issues.some((i) => i.includes('response field "message"')), "wrong response field");
});

test("a collection that follows the contract has no mismatches", () => {
  const good = { requests: [{ name: "ok", auth: true, body: { items: [], shippingAddress: {} }, expectStatus: 201, expectFields: ["orderId", "status"] }] };
  assert.deepEqual(crossCheck(contract, good), []);
});
