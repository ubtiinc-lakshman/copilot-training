// Happy-path guards: these pass before AND after your fixes. Run: npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { paginate, applyCoupon, stockFor } = require("./bugs");

test("paginate returns a full page from the middle of the list", () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5, 6], 2, 2).length, 2);
});

test("applyCoupon leaves the total alone for an unknown code", () => {
  assert.equal(applyCoupon(1000, "NOPE"), 1000);
});

test("stockFor finds an exact SKU", () => {
  assert.equal(stockFor("AB-1"), 4);
});
