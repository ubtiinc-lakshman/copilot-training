// Loads the GitHub Copilot course documents into Neon (table pe_docs, course = "copilot"): playbooks, lab workbooks, reference material,
// the program plan and the converted guides (participants), plus runbooks, facilitator guides and checklists (facilitators only, database only).
// Run scripts/convert-copilot-sources.py first (Word and HTML sources). Per-day pages, quizzes and assignments are NOT loaded here: they already exist on the site.
// Usage: DATABASE_URL=... node scripts/seed-copilot-docs.mjs "<Github Copilot folder>"      (DRY=1 lists without writing)
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const [src] = process.argv.slice(2);
if (!src) throw new Error('Usage: node scripts/seed-copilot-docs.mjs "<Github Copilot folder>"');
const sql = neon(process.env.DATABASE_URL ?? "postgres://dry");

const docs = [];
const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const slugify = (s) => "gc-" + s.toLowerCase().replace(/\.[a-z]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleOf = (file, body) => /^#\s+(.+)$/m.exec(body)?.[1].trim() ?? path.basename(file, path.extname(file)).replace(/_/g, " ");

function addFile(file, { audience, section, title }) {
  const body = read(file);
  docs.push({ slug: slugify(path.basename(file)), title: title ?? titleOf(file, body), audience, section, sort: docs.length, body });
}
function addDir(dir, opts) {
  for (const f of fs.readdirSync(path.join(src, dir)).sort()) {
    if (f.endsWith(".md") && !(opts.only && !opts.only.test(f))) addFile(path.join(src, dir, f), opts);
  }
}

// The plans and the guides are for facilitators; participants get the playbooks, workbooks and reference sheets.
addFile(path.join(src, "GitHub-Copilot-Training-Plan.md"), { audience: "facilitator", section: "Program plan", title: "Training plan: summary" });
addFile(path.join(src, "GitHub-Copilot-Training-Plan-Detailed.md"), { audience: "facilitator", section: "Program plan", title: "Training plan: detailed (day by day)" });
addFile(path.resolve("data/copilot-converted/github-copilot-training-program.md"), { audience: "facilitator", section: "Program plan", title: "GitHub Copilot Training Program" });
addFile(path.resolve("data/copilot-converted/ai-enabled-development-guide.md"), { audience: "facilitator", section: "Guides", title: "AI Enabled Development Guide" });
addFile(path.resolve("data/copilot-converted/ai-development-handbook.md"), { audience: "facilitator", section: "Guides", title: "AI Development Practical Handbook" });
addDir("3_TEAM_PLAYBOOKS", { audience: "all", section: "Playbooks" });
addDir("4_LAB_WORKBOOKS", { audience: "all", section: "Lab workbooks" });
addDir("5_REFERENCE_MATERIALS", { audience: "all", section: "Reference", only: /^(Advanced|Common|Core|Glossary|Prompt)/ });
addDir("1_MASTER_PROGRAM", { audience: "all", section: "Reference", only: /^05_/ });

// Facilitators only
addDir("1_MASTER_PROGRAM", { audience: "facilitator", section: "Runbooks", only: /^0[0-46-8]_/ });
addDir("2_FACILITATOR_GUIDES", { audience: "facilitator", section: "Facilitator guides" });
addDir("6_DELIVERY_CHECKLISTS", { audience: "facilitator", section: "Delivery checklists" });
addFile(path.join(src, "5_REFERENCE_MATERIALS/Facilitator_QA_Guide.md"), { audience: "facilitator", section: "Runbooks" });
// Docs folder: the Day 7 gate. Both are facilitator-only (the handout would show the tasks before the day; the scoring guide has the answers).
// The three "for Director" plans in that folder are deliberately not loaded.
addFile(path.resolve("data/copilot-converted/day-7-gate-a-participant-handout.md"), { audience: "facilitator", section: "Day 7 gate", title: "Day 7 gate: participant handout" });
addFile(path.resolve("data/copilot-converted/day-7-gate-b-facilitator-scoring-guide.md"), { audience: "facilitator", section: "Day 7 gate", title: "Day 7 gate: facilitator scoring guide" });

if (process.env.DRY) {
  for (const d of docs) console.log(d.audience.padEnd(11), d.section.padEnd(20), d.slug, d.body.length);
  process.exit(0);
}
await sql`CREATE TABLE IF NOT EXISTS pe_docs (slug TEXT PRIMARY KEY, title TEXT NOT NULL, audience TEXT NOT NULL, section TEXT NOT NULL, sort INTEGER NOT NULL, body TEXT NOT NULL)`;
await sql`ALTER TABLE pe_docs ADD COLUMN IF NOT EXISTS course TEXT NOT NULL DEFAULT 'prompt-engineering'`;
for (const d of docs) {
  await sql`INSERT INTO pe_docs (slug, course, title, audience, section, sort, body) VALUES (${d.slug}, 'copilot', ${d.title}, ${d.audience}, ${d.section}, ${d.sort}, ${d.body})
    ON CONFLICT (slug) DO UPDATE SET course = 'copilot', title = EXCLUDED.title, audience = EXCLUDED.audience, section = EXCLUDED.section, sort = EXCLUDED.sort, body = EXCLUDED.body`;
}
console.log(`${docs.length} documents (${docs.filter((d) => d.audience === "facilitator").length} facilitator-only)`);
