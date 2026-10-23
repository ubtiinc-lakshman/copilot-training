// Day 22: flags rules in an instructions file that cannot be checked against a live suggestion.
// Usage: node check-instructions.js path/to/copilot-instructions.md
// A rule is a markdown bullet. It is flagged if it uses a vague word and has no concrete anchor.
const fs = require("node:fs");

const VAGUE = ["good", "clean", "best practice", "high quality", "readable", "modern", "proper", "nice", "well"];

function vagueRules(markdown) {
  return markdown
    .split("\n")
    .filter((l) => /^\s*[-*]\s+/.test(l))
    .map((l) => l.replace(/^\s*[-*]\s+/, "").trim())
    .filter((rule) => VAGUE.some((w) => rule.toLowerCase().includes(w)) && !/`[^`]+`|\d/.test(rule));
}

module.exports = { vagueRules };

if (require.main === module) {
  const found = vagueRules(fs.readFileSync(process.argv[2], "utf8"));
  for (const r of found) console.error(`not checkable: ${r}`);
  console.log(found.length ? `${found.length} vague rule(s)` : "every rule has a concrete anchor");
  process.exit(found.length ? 1 : 0);
}
