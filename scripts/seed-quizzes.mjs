// Loads quiz questions and answers into Neon from data/quizzes.json (git-ignored, so answers stay out of the public repo).
// Usage: DATABASE_URL=... node scripts/seed-quizzes.mjs [file, default data/quizzes.json; the Prompt Engineering quizzes are in data/pe-quizzes.json]   (re-run to update; it replaces each day listed)
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const quizzes = JSON.parse(fs.readFileSync(process.argv[2] ?? "data/quizzes.json", "utf8"));
await sql`CREATE TABLE IF NOT EXISTS quizzes (day INTEGER PRIMARY KEY, questions JSONB NOT NULL)`;
for (const [day, questions] of Object.entries(quizzes)) {
  await sql`INSERT INTO quizzes (day, questions) VALUES (${Number(day)}, ${JSON.stringify(questions)}::jsonb)
    ON CONFLICT (day) DO UPDATE SET questions = EXCLUDED.questions`;
  console.log(`day ${day}: ${questions.length} questions`);
}
