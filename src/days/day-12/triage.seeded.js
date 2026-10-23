// Day 12 (QA): three failing tests. Do NOT fix the code. For each, classify it
// (real defect / flaky test / bad test data) and write the evidence. Run: npm run test:seeded
const { test } = require("node:test");
const assert = require("node:assert/strict");

// --- code under test ---
function lineTotal(priceDollars, qty) {
  return priceDollars * qty;
}
function loadProfile() {
  // pretends to call a service: answers after 0-20 ms
  return new Promise((resolve) => setTimeout(() => resolve({ name: "Asha" }), Math.random() * 20));
}
function daysSince(isoDate, today = new Date("2026-11-05")) {
  return Math.floor((today - new Date(isoDate)) / 86400000);
}

// --- tests ---
test("TRIAGE-1 line total for 3 items at $0.10 is $0.30", () => {
  assert.equal(lineTotal(0.1, 3), 0.3);
});

test("TRIAGE-2 profile is loaded within 10 ms", async () => {
  const started = Date.now();
  const profile = await loadProfile();
  assert.equal(profile.name, "Asha");
  assert.ok(Date.now() - started <= 10);
});

test("TRIAGE-3 account created 2026-13-45 is older than 30 days", () => {
  assert.ok(daysSince("2026-13-45") > 30);
});
