// Behavior guard: an optimization must return exactly the same data. Passes before AND after.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getOrdersForUser } = require("./ordersEndpoint");

test("should return only the requested user's orders, with the user name", () => {
  const orders = getOrdersForUser("u-5");
  assert.equal(orders.length, 10);
  assert.ok(orders.every((o) => o.userId === "u-5" && o.userName === "User 5"));
});

test("should keep the original order of results", () => {
  const ids = getOrdersForUser("u-5").map((o) => o.id);
  assert.deepEqual(ids, [...ids].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2))));
});

test("should return an empty list for an unknown user", () => {
  assert.deepEqual(getOrdersForUser("nobody"), []);
});
