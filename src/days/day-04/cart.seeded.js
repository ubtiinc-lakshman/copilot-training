// SEEDED FAILURE (QA). Run with: npm run test:seeded
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calculateCartTotal } = require("./cart.service");

test("applies SAVE10 once to a 100 cart", () => {
  assert.equal(calculateCartTotal([{ price: 50, qty: 2 }], "SAVE10"), 90);
});

test("no code means no discount", () => {
  assert.equal(calculateCartTotal([{ price: 50, qty: 2 }], undefined), 100);
});
