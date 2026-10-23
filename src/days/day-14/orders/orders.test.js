// Day 14 (QA): these assertions encode the OLD boolean status. After the Dev change, update every
// assertion (in every test file) to the new enum so the suite is consistent. `npm test` must stay green.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createOrder, markShipped, canCancel } = require("./service");
const { toApiOrder, fromApiOrder } = require("./api");
const { summarize } = require("./report");
const { badge } = require("./badge");

test("a new order is not shipped", () => {
  assert.equal(createOrder("o1", 500).shipped, false);
});

test("a shipped order cannot be cancelled", () => {
  assert.equal(canCancel(markShipped(createOrder("o1", 500))), false);
});

test("api round trip keeps the shipped flag", () => {
  const order = markShipped(createOrder("o1", 500));
  assert.equal(fromApiOrder(toApiOrder(order)).shipped, true);
});

test("report counts shipped orders", () => {
  const orders = [markShipped(createOrder("a", 1)), createOrder("b", 2)];
  assert.deepEqual(summarize(orders), { shipped: 1, notShipped: 1 });
});

test("badge shows Shipped for a shipped order", () => {
  assert.equal(badge(markShipped(createOrder("o1", 500))), "Shipped");
});
