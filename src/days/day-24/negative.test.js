// Day 24 (QA): one negative test per finding the Dev reports. A finding without a proving test is just an opinion.
// The first test passes today and PROVES a finding; write the rest with Copilot (the target is
// ./seeded/auth-module.js). When the Dev fixes a finding, its proving test should be flipped to assert the safe behavior.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { findUserQuery } = require("./seeded/auth-module");

test("PROOF injection: an email containing a quote breaks out of the SQL string", () => {
  const q = findUserQuery("x' OR '1'='1");
  assert.ok(q.includes("OR '1'='1"), "attacker-controlled text became SQL: " + q);
});

test("PROOF weak crypto: two users with the same password get the same unsalted hash", { todo: "write with Copilot" });
test("PROOF secrets in logs: login writes the plain password to the console", { todo: "write with Copilot" });
test("PROOF hardcoded secret: the token can be forged from the source code", { todo: "write with Copilot" });
