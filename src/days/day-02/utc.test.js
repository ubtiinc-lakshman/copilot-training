const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getUtcTimestamp } = require("./utc");

// todo: becomes a real check once Copilot's answer is pasted into utc.js.
test("getUtcTimestamp returns an ISO-8601 UTC string", { todo: "paste Copilot's answer into utc.js" }, () => {
  assert.match(String(getUtcTimestamp()), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
});
