// Day 26: validate rows against the orders schema (schema.sql). Prints every violation; exit 1 if any.
// Usage: node validate-orders.js rows.json
// Rows are objects: { id, user_id, status, total_cents, created_at }.
const fs = require("node:fs");

const STATUSES = ["pending", "shipped", "cancelled"];

// Date.parse accepts 2026-02-31 (it rolls over), so compare the calendar date after a round trip.
function isRealDate(value) {
  const d = new Date(value);
  return typeof value === "string" && !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value.slice(0, 10);
}

function validateRows(rows) {
  const problems = [];
  const ids = new Set();
  rows.forEach((r, i) => {
    const where = `row ${i + 1}`;
    if (!Number.isInteger(r.id)) problems.push(`${where}: id must be an integer`);
    else if (ids.has(r.id)) problems.push(`${where}: duplicate id ${r.id}`);
    else ids.add(r.id);
    if (!Number.isInteger(r.user_id)) problems.push(`${where}: user_id is NOT NULL and must be an integer`);
    if (!STATUSES.includes(r.status)) problems.push(`${where}: status "${r.status}" is not one of ${STATUSES.join("/")}`);
    if (!Number.isInteger(r.total_cents) || r.total_cents < 0) problems.push(`${where}: total_cents must be a non-negative integer`);
    if (!isRealDate(r.created_at)) problems.push(`${where}: created_at must be a valid timestamp`);
    for (const [k, v] of Object.entries(r)) if (typeof v === "string" && /@(?!example\.)/.test(v)) problems.push(`${where}: ${k} looks like a real email address (PII)`);
  });
  return problems;
}

module.exports = { validateRows };

if (require.main === module) {
  const problems = validateRows(JSON.parse(fs.readFileSync(process.argv[2], "utf8")));
  problems.forEach((p) => console.error(p));
  console.log(problems.length ? `${problems.length} problem(s)` : "all rows satisfy the schema");
  process.exit(problems.length ? 1 : 0);
}
