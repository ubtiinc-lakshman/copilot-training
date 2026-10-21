// Day 6 (QA): these tests have assertions but no descriptions. Ask Copilot for a
// Given-When-Then description above each test, then check each one against the assertions.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createRateLimiter } = require("./rateLimiter");

test("test 1", () => {
  const check = createRateLimiter({ max: 2, windowMs: 1000, now: () => 0 });
  assert.equal(check("a").allowed, true);
  assert.equal(check("a").allowed, true);
  assert.equal(check("a").allowed, false);
});

test("test 2", () => {
  const check = createRateLimiter({ max: 1, windowMs: 1000, now: () => 0 });
  check("a");
  assert.equal(check("b").allowed, true);
});

test("test 3", () => {
  let t = 0;
  const check = createRateLimiter({ max: 1, windowMs: 1000, now: () => t });
  check("a");
  t = 1000;
  assert.equal(check("a").allowed, true);
});

test("test 4", () => {
  assert.throws(() => createRateLimiter());
});

test("test 5", () => {
  const check = createRateLimiter({ max: 3, windowMs: 1000, now: () => 0 });
  assert.equal(check("a").remaining, 2);
});
