// Loads the Prompt Engineering reference documents into Neon (table pe_docs): playbooks, reference material, lab workbooks, the prompt
// repository, sample projects (built from the sample folders as "create this file and paste this" pages) and the facilitator-only runbooks.
// The facilitator documents live only in the database, never in the public repo.
// Usage: DATABASE_URL=... node scripts/seed-pe-docs.mjs "<Prompt Engineering folder>" "<Prompt_Training folder>"
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const [src, samples] = process.argv.slice(2);
if (!src || !samples) throw new Error('Usage: node scripts/seed-pe-docs.mjs "<Prompt Engineering folder>" "<Prompt_Training folder>"');
const sql = neon(process.env.DATABASE_URL ?? "postgres://dry");

const docs = []; // { slug, title, audience: "all" | "facilitator", section, sort, body }
const slugify = (s) => s.toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleOf = (file, body) => /^#\s+(.+)$/m.exec(body)?.[1].trim() ?? path.basename(file, path.extname(file)).replace(/_/g, " ");
const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");

function addDir(dir, { audience, section, prefix = "", only }) {
  const full = path.join(src, dir);
  for (const f of fs.readdirSync(full).sort()) {
    if (!f.endsWith(".md") || (only && !only.test(f))) continue;
    const body = read(path.join(full, f));
    docs.push({ slug: prefix + slugify(f), title: titleOf(f, body), audience, section, sort: docs.length, body });
  }
}

// Participant material
addDir("3_TEAM_PLAYBOOKS", { audience: "all", section: "Team playbooks" });
addDir("4_LAB_WORKBOOKS", { audience: "all", section: "Lab workbooks", only: /^(Lab_\d|Updated_Lab)/ });
addDir("5_REFERENCE_MATERIALS", { audience: "all", section: "Reference", only: /^(Common|Core|Glossary|Prompt_Formula|Session_\d_Prompt)/ });
addDir("1_MASTER_PROGRAM", { audience: "all", section: "Reference", only: /^05_/ });
for (const team of fs.readdirSync(path.join(src, "Prompt Repository"), { withFileTypes: true })) {
  if (team.isDirectory()) addDir(path.join("Prompt Repository", team.name), { audience: "all", section: "Prompt repository", prefix: `repo-${slugify(team.name)}-` });
}
docs.push({ slug: "prompt-repository-readme", title: "Prompt repository: how to use and contribute", audience: "all", section: "Prompt repository", sort: docs.length, body: read(path.join(src, "Prompt Repository/README.md")) + "\n\n---\n\n" + read(path.join(src, "Prompt Repository/CONTRIBUTION_TEMPLATE.md")) });
docs.push({ slug: "assessment-instructions", title: "Certification assessment instructions", audience: "all", section: "Reference", sort: docs.length, body: read(path.join(src, "References/Assessment_Instructions.md")) });

// Facilitator-only material
addDir("1_MASTER_PROGRAM", { audience: "facilitator", section: "Runbooks", only: /^0[0-48]_|^0[67]_/ });
addDir("2_FACILITATOR_GUIDES", { audience: "facilitator", section: "Facilitator guides" });
addDir("6_DELIVERY_CHECKLISTS", { audience: "facilitator", section: "Delivery checklists" });
docs.push({ slug: "facilitator-qa-guide", title: "Facilitator Q&A guide", audience: "facilitator", section: "Runbooks", sort: docs.length, body: read(path.join(src, "5_REFERENCE_MATERIALS/Facilitator_Q&A_Guide.md")) });

// Sample projects: every text file becomes a "create this file, paste this" block.
const LANG = { ".sql": "sql", ".yml": "yaml", ".js": "js", ".java": "java", ".xml": "xml", ".bicep": "bicep", ".properties": "properties", ".md": "markdown", ".txt": "text", ".bicepparam": "bicep" };
function sample({ slug, title, root, files, intro }) {
  const list = files.flatMap((f) => {
    const p = path.join(samples, root, f);
    if (fs.statSync(p).isDirectory()) return walk(p).map((x) => path.relative(path.join(samples, root), x).replace(/\\/g, "/"));
    return [f];
  });
  const blocks = list.map((f) => `### ${f}\n\nCreate this file and paste:\n\n\`\`\`\`${LANG[path.extname(f)] ?? "text"}\n${read(path.join(samples, root, f)).trimEnd()}\n\`\`\`\``);
  const folder = root.replace(/^Advanced_/, "").toLowerCase();
  const body = `# ${title}\n\n${intro}\n\n## Two ways to set it up\n\n1. **By hand:** create a folder named \`${folder}\`, then create each file below at the path shown and paste its content.\n2. **With Copilot:** open an empty folder in VS Code, open Copilot Chat in agent mode and paste: "Create the following project exactly as listed, one file per heading, using the path in the heading and the code block as the content." then paste the whole page.\n\nThe data is invented. Do not replace it with real company data.\n\n## Files\n\n${blocks.join("\n\n")}\n`;
  docs.push({ slug, title, audience: "all", section: "Sample projects", sort: docs.length, body });
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === "target" || e.name === "node_modules" ? [] : walk(path.join(dir, e.name))) : [path.join(dir, e.name)]));
}
sample({ slug: "sample-snowflake-dbt", title: "Sample project: dbt models and data-quality tests", root: "Advanced_DataEngineer", intro: "A small dbt project (staging model, a customer daily revenue fact and custom data-quality tests). Use it for the Snowflake track: ask the AI to explain, tune, document and test it.", files: ["dbt_project.yml", "packages.yml", "models", "tests/custom_data_quality_fct_customer_daily_revenue.sql", "tests/custom_duplicate_detection_fct_customer_daily_revenue.sql", "tests/custom_orphaned_records_fct_customer_daily_revenue.sql", "tests/custom_time_gap_detection_fct_customer_daily_revenue.sql", "tests/custom_zero_revenue_check_fct_customer_daily_revenue.sql", "Prompts.txt"] });
sample({ slug: "sample-qa-playwright", title: "Sample project: Playwright login page object and test", root: "Advanced_DataEngineer", intro: "A page object and a spec for a login page, plus the password-reset test scenarios. Use it for the QA track: ask the AI to extend the coverage and find what is missing.", files: ["PageObjects/LoginPage.js", "tests/login.spec.js", "tests/PASSWORD_RESET_TEST_CASES.md", "tests/API_PASSWORD_RESET_TEST_SCENARIOS.md"] });
sample({ slug: "sample-qa-api-tests", title: "Sample project: Java API tests for password reset", root: "Advanced_DataEngineer/api-tests", intro: "A TestNG and REST-assured API test project for a password-reset endpoint (base URL is a placeholder). Use it for the QA track: review the cases, find gaps, add tests.", files: ["pom.xml", "README.md", "src"] });
sample({ slug: "sample-azure-bicep", title: "Sample project: Azure Bicep deployment", root: "Advanced_Azure_Cloud_Practice", intro: "A Bicep template with a parameter file (secrets by Key Vault reference, placeholders for ids) and the demo prompts. Use it for the Azure track: review security, improve it, explain the risks.", files: ["main.bicep", "main.bicepparam", "Session_5_Demo_Prompts.txt"] });
sample({ slug: "sample-powerbi-dashboard", title: "Sample project: Power BI support dashboard guide", root: "Advanced_PowerBI_Platform", intro: "A step-by-step dashboard build guide and the demo prompts for a support-ticket dashboard. The Power BI project files are not included; follow the guide to create the model, or ask the AI to generate sample tables first.", files: ["Dashboard_Build_Guide.md", "demo-prompts.txt"] });

if (process.env.DRY) {
  for (const d of docs) console.log(d.audience.padEnd(11), d.section.padEnd(18), d.slug, d.body.length);
  process.exit(0);
}
await sql`CREATE TABLE IF NOT EXISTS pe_docs (slug TEXT PRIMARY KEY, title TEXT NOT NULL, audience TEXT NOT NULL, section TEXT NOT NULL, sort INTEGER NOT NULL, body TEXT NOT NULL)`;
for (const d of docs) {
  await sql`INSERT INTO pe_docs (slug, title, audience, section, sort, body) VALUES (${d.slug}, ${d.title}, ${d.audience}, ${d.section}, ${d.sort}, ${d.body})
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, audience = EXCLUDED.audience, section = EXCLUDED.section, sort = EXCLUDED.sort, body = EXCLUDED.body`;
}
console.log(`${docs.length} documents (${docs.filter((d) => d.audience === "facilitator").length} facilitator-only)`);
