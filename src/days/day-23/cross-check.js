// Day 23: does every component named in the architecture note appear in the test strategy's coverage matrix?
// Usage: node cross-check.js ARCHITECTURE.md TEST_STRATEGY.md   (exit 1 if components are missing)
const fs = require("node:fs");

// Components are the bold names in the "## Components" list: - **Name**: ...
function components(architecture) {
  const section = architecture.split(/^## /m).find((s) => s.startsWith("Components")) ?? "";
  return [...section.matchAll(/^\s*[-*]\s+\*\*([^*]+)\*\*/gm)].map((m) => m[1].trim());
}

function missingFromMatrix(architecture, strategy) {
  const matrix = strategy.toLowerCase();
  return components(architecture).filter((c) => !matrix.includes(c.toLowerCase()));
}

module.exports = { components, missingFromMatrix };

if (require.main === module) {
  const [arch, strat] = process.argv.slice(2).map((f) => fs.readFileSync(f, "utf8"));
  const missing = missingFromMatrix(arch, strat);
  console.log(missing.length ? `Not covered: ${missing.join(", ")}` : "Every component is in the coverage matrix");
  process.exit(missing.length ? 1 : 0);
}
