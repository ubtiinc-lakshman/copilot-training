// Loads the pain-point bank into Neon from data/painpoints.json (git-ignored, so the bank stays out of the public repo).
// Usage: npx vercel env run -e production -- node scripts/seed-painpoints.mjs
//        node scripts/seed-painpoints.mjs --check     (validate the file only, no database)
// Re-run to add or update entries. It never deletes: a pain point that is already assigned stays assigned.
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";
import { PROGRAM_TABLES } from "../src/lib/schema.ts";

const bank = JSON.parse(fs.readFileSync("data/painpoints.json", "utf8"));

const problems = [];
const ids = new Set();
const titles = new Set();
const entities = new Map();
for (const p of bank) {
  for (const f of ["id", "week", "audience", "category", "entity", "title", "problem"]) if (!p[f]) problems.push(`${p.id ?? "?"}: missing ${f}`);
  if (!Number.isInteger(p.week) || p.week < 1 || p.week > 5) problems.push(`${p.id}: week must be 1-5`);
  if (!["common", "org"].includes(p.audience)) problems.push(`${p.id}: audience must be common or org`);
  if (!Array.isArray(p.mustHave) || p.mustHave.length < 3) problems.push(`${p.id}: needs at least 3 mustHave items`);
  if (ids.has(p.id)) problems.push(`${p.id}: duplicate id`);
  if (titles.has(p.title.toLowerCase())) problems.push(`${p.id}: duplicate title`);
  const key = `${p.week}|${p.entity.toLowerCase()}`;
  if (entities.has(key)) problems.push(`${p.id}: same entity as ${entities.get(key)} ("${p.entity}")`);
  ids.add(p.id);
  titles.add(p.title.toLowerCase());
  entities.set(key, p.id);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
const perWeek = {};
for (const p of bank) perWeek[p.week] = (perWeek[p.week] ?? 0) + 1;
console.log(`bank is valid: ${bank.length} pain points`, perWeek);
if (process.argv.includes("--check")) process.exit(0);

const sql = neon(process.env.DATABASE_URL);
for (const ddl of PROGRAM_TABLES) await sql.query(ddl);
for (const { id, week, ...data } of bank) {
  await sql`INSERT INTO painpoints (id, week, data) VALUES (${id}, ${week}, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET week = EXCLUDED.week, data = EXCLUDED.data`;
}
console.log("seeded");
