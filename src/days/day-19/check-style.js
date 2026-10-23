// Day 19: checks STYLE_GUIDE.md rules 1-3 on a source string. Usage: node check-style.js [file...]
// With no arguments it checks shared/*.js. Exits 1 if any violation is found.
const fs = require("node:fs");
const path = require("node:path");

function check(source, { isTest = false } = {}) {
  const issues = [];
  source.split("\n").forEach((line, i) => {
    const n = i + 1;
    if (/\bconsole\.log\(/.test(line)) issues.push(`line ${n}: console.log in app code (rule 1)`);
    if (/\bvar\s/.test(line)) issues.push(`line ${n}: var (rule 2)`);
    const t = line.match(/\b(?:test|it)\(\s*["'`]([^"'`]+)["'`]/);
    if (isTest && t && !t[1].startsWith("should")) issues.push(`line ${n}: test title "${t[1]}" does not start with "should" (rule 3)`);
  });
  return issues;
}

module.exports = { check };

if (require.main === module) {
  const files = process.argv.length > 2 ? process.argv.slice(2) : fs.readdirSync(path.join(__dirname, "shared")).filter((f) => f.endsWith(".js")).map((f) => path.join(__dirname, "shared", f));
  let bad = 0;
  for (const f of files) {
    for (const issue of check(fs.readFileSync(f, "utf8"), { isTest: f.endsWith(".test.js") })) {
      console.error(`${path.basename(f)} ${issue}`);
      bad++;
    }
  }
  process.exit(bad ? 1 : 0);
}
