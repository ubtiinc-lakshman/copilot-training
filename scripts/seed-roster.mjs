// Loads the participant roster into Neon from data/roster.json (git-ignored: names, emails and GitHub IDs stay out of the public repo).
// Usage: npx vercel env run -e production -- node scripts/seed-roster.mjs
// Re-run to add or update people. It never deletes; remove people on the progress page.
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";
import { PROGRAM_TABLES } from "../src/lib/schema.ts";

const roster = JSON.parse(fs.readFileSync("data/roster.json", "utf8"));
const sql = neon(process.env.DATABASE_URL);
for (const ddl of PROGRAM_TABLES) await sql.query(ddl);
for (const p of roster) {
  await sql`INSERT INTO roster (email, name, team, github_id) VALUES (${p.email.toLowerCase()}, ${p.name}, ${p.team}, ${p.github})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, team = EXCLUDED.team, github_id = EXCLUDED.github_id`;
}
console.log(`roster seeded: ${roster.length} people`);
