// Day 18: compare a generated test collection with the Dev's real contract, field by field.
// Returns a list of human-readable mismatches (empty list = they agree).
function crossCheck(contract, collection) {
  const issues = [];
  const required = contract.request.required;
  const okStatuses = Object.keys(contract.responses);
  for (const r of collection.requests) {
    if (r.body !== undefined && r.auth !== false) {
      for (const f of required) if (!(f in r.body)) issues.push(`${r.name}: request is missing required field "${f}"`);
      for (const f of Object.keys(r.body)) if (!required.includes(f)) issues.push(`${r.name}: request has unknown field "${f}"`);
    }
    if (!okStatuses.includes(String(r.expectStatus))) issues.push(`${r.name}: expects status ${r.expectStatus}, contract has ${okStatuses.join("/")}`);
    const allowed = contract.responses[String(r.expectStatus)]?.fields ?? [];
    for (const f of r.expectFields ?? []) if (allowed.length && !allowed.includes(f)) issues.push(`${r.name}: expects response field "${f}", contract has ${allowed.join(", ")}`);
  }
  return issues;
}

module.exports = { crossCheck };
