// Day 3 (QA): five assertion helpers, each driven by the comment above it.
// After accepting, check the helper really FAILS when it should (mutate the expected value).
const assert = require("node:assert/strict");

// Assert that response.status equals 201 and response.body.id is a non-empty string.
function assertCreated(response) {}

// Assert that the user object has the given role in its roles array.
function assertUserHasRole(user, role) {}

// Assert that response.body has every key listed in schema.required, each of the declared type.
function assertResponseSchemaValid(response, schema) {}

// Assert that the value is a valid ISO-8601 date string.
function assertIsoDate(value) {}

// Assert that the array is sorted ascending by the given key.
function assertSortedBy(items, key) {}

module.exports = { assert, assertCreated, assertUserHasRole, assertResponseSchemaValid, assertIsoDate, assertSortedBy };
