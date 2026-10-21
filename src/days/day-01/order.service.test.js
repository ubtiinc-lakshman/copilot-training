// Test suite for the QA track. Day 1: have Copilot summarize this file, then write assertions from comments.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calculateTotal, applyDiscount, countItems, isValidEmail } = require("./order.service");

test("calculateTotal sums price * quantity", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 },
  ];
  assert.equal(calculateTotal(items), 25);
});

test("calculateTotal returns 0 for an empty order", () => {
  assert.equal(calculateTotal([]), 0);
});

test("applyDiscount applies SAVE10", () => {
  assert.equal(applyDiscount(100, "SAVE10"), 90);
});

test("applyDiscount ignores unknown codes", () => {
  assert.equal(applyDiscount(100, "NOPE"), 100);
});

// TODO (Day 1 - QA, suggestion 1): assert that countItems sums the quantities across all items.
// TODO (Day 1 - QA, suggestion 2): assert that applyDiscount with SAVE20 on 200 returns 160.
// TODO (Day 1 - QA, suggestion 3): assert that calculateTotal handles a single item with quantity 0.

test("validates correct and incorrect email ids", () => {
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Use the isValidEmail function from the service

  const validEmails = [
    "user@example.com",
    "first.last@example.co.in",
    "user_name123@sub.example.com",
  ];

  const invalidEmails = [
    "plainaddress",
    "@missingusername.com",
    "user@.com",
    "user@domain",
    "user domain@example.com",
  ];

  validEmails.forEach((email) => {
    assert.equal(isValidEmail(email), true, `Expected ${email} to be valid`);
  });

  invalidEmails.forEach((email) => {
    assert.equal(isValidEmail(email), false, `Expected ${email} to be invalid`);
  });
});

