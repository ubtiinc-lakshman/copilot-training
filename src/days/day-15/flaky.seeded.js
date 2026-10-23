// Day 15 (QA): this test is flaky. Run it 10 times: node --test src/days/day-15/flaky.seeded.js
// Find the REAL root cause with Chat (waits / assertions / isolation) and fix it. A longer sleep is NOT a fix.
const { test } = require("node:test");
const assert = require("node:assert/strict");

const cache = new Map(); // shared between tests

function saveDraft(id, text) {
  // pretends to write to a slow store: lands after 0-30 ms
  setTimeout(() => cache.set(id, text), Math.random() * 30);
}

test("a saved draft can be read back", async () => {
  saveDraft("d1", "hello");
  await new Promise((r) => setTimeout(r, 15)); // "wait long enough"
  assert.equal(cache.get("d1"), "hello");
});

test("a new draft starts empty", () => {
  assert.equal(cache.size, 0); // fails when it runs after the test above
});
