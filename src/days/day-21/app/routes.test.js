// The conventions the agent must respect, as tests. Keep them green while the agent works.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { handleListOrders, handleGetOrder } = require("./routes");

test("should return 401 without a user", () => {
  assert.equal(handleListOrders({}).status, 401);
});

test("should list only the caller's orders", () => {
  const res = handleListOrders({ userId: "u-1" });
  assert.equal(res.status, 200);
  assert.ok(res.body.orders.every((o) => o.userId === "u-1"));
});

test("should return 404 with an error code for an unknown order", () => {
  assert.deepEqual(handleGetOrder({ userId: "u-1", params: { id: "nope" } }), { status: 404, body: { error: "not_found" } });
});
