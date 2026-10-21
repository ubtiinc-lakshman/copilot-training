// SEEDED FAILURE (Dev). Run with: npm run test:seeded
// Expected after the fix: an unknown id returns null, and the happy path still works.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { users, getUserName } = require("./user.service");

test("returns the name for a known id (happy path)", () => {
  assert.equal(getUserName(users, 1), "Asha");
});

test("returns null for an unknown id", () => {
  assert.equal(getUserName(users, 99), null);
});
