// Day 15 (Dev): safety net for the refactor. One baseline passes; add the rest with Copilot
// (every branch: validation errors, each coupon, each shipping band, non-US, rounding).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { processOrder } = require("./legacy");

test("baseline: US order, no coupon, mid shipping band", () => {
  const r = processOrder({ id: "o1", email: "a@b.co", items: [{ price: 2000, qty: 2 }] }, { country: "US" });
  assert.deepEqual(r, { ok: true, total: 4000, discount: 0, shipping: 199, tax: 280, grand: 4479 });
});

test("rejects an empty order", { todo: "characterize with Copilot" });
test("SAVE25 only applies from 5000", { todo: "characterize with Copilot" });
test("non-US adds 1500 shipping and no tax", { todo: "characterize with Copilot" });
