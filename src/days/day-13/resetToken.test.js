// Day 13 (Dev): the first test passes. Ask Copilot for tests targeting ~80% coverage, then ask
// "what did it skip?" and re-prompt for the negative and boundary cases. Report coverage before/after.
//   node --test --experimental-test-coverage src/days/day-13/resetToken.test.js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createTokenStore } = require("./resetToken");

test("a freshly issued token can be redeemed once", () => {
  const store = createTokenStore(() => 0);
  store.issue("t1", "u1");
  assert.deepEqual(store.redeem("t1"), { ok: true, userId: "u1" });
});

test("expired token is rejected", { todo: "generate with Copilot" });
test("already-used token is rejected", { todo: "generate with Copilot" });
test("boundary: exactly at the TTL still works, 1 ms later does not", { todo: "generate with Copilot" });
test("issue() with a missing argument throws", { todo: "generate with Copilot" });
