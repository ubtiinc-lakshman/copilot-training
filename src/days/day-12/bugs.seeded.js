// Day 12 (Dev): these FAIL until you fix bugs.js. Run: npm run test:seeded
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { paginate, applyCoupon, stockFor } = require("./bugs");

test("paginate page 1 is the first page", () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5, 6], 1, 2), [1, 2]);
});

test("paginate page 3 is the last two items", () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5, 6], 3, 2), [5, 6]);
});

test("applyCoupon SAVE10 takes 10% off 1000 cents", () => {
  assert.equal(applyCoupon(1000, "SAVE10"), 900);
});

test("stockFor ignores case and surrounding spaces", () => {
  assert.equal(stockFor(" ab-1 "), 4);
});
