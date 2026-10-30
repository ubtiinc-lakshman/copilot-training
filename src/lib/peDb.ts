// Database reads and writes for the Prompt Engineering course.
import type { Sql } from "@/lib/assign";
import { PE_PASS_PERCENT, PE_QUIZ_MIN, peLevel } from "@/lib/pe";

type User = { email: string; name: string };
export const PE_FIELDS = ["scenario", "initial", "refined", "output", "validation"] as const;
export type PeFields = Record<(typeof PE_FIELDS)[number], string>;

export async function savePeSubmission(sql: Sql, user: User, unit: string, fields: PeFields) {
  await sql`INSERT INTO pe_submissions (email, name, unit, fields) VALUES (${user.email}, ${user.name}, ${unit}, ${JSON.stringify(fields)}::jsonb)
    ON CONFLICT (email, unit) DO UPDATE SET fields = EXCLUDED.fields, submitted_at = now(), status = 'pending'`;
}

// A person's submissions and the quizzes they passed (best attempt >= the pass mark), and the level those give.
export async function loadPeState(sql: Sql, email: string) {
  const [subs, quizzes] = await Promise.all([
    sql`SELECT unit, fields, submitted_at, status, feedback FROM pe_submissions WHERE email = ${email} AND unit NOT LIKE 'gt-%'`,
    sql`SELECT day, max(percent) AS best FROM results WHERE email = ${email} AND day >= ${PE_QUIZ_MIN} AND day < 400 GROUP BY day`,
  ]);
  const passed = quizzes.filter((q) => Number(q.best) >= PE_PASS_PERCENT).map((q) => Number(q.day));
  const best = Object.fromEntries(quizzes.map((q) => [Number(q.day), Number(q.best)]));
  // A lab sent back for changes does not count until it is resubmitted.
  const submitted = subs.filter((s) => s.status !== "changes").map((s) => s.unit as string);
  return { subs, submitted, passed, best, level: peLevel(submitted, passed) };
}

export async function loadPeLevel(sql: Sql, email: string) {
  return (await loadPeState(sql, email)).level;
}

// Everyone's work, for the facilitator page.
export async function loadPeProgress(sql: Sql) {
  const [subs, quizzes] = await Promise.all([
    sql`SELECT lower(email) AS email, name, unit, fields, submitted_at, status, feedback FROM pe_submissions WHERE unit NOT LIKE 'gt-%' ORDER BY (status = 'pending') DESC, submitted_at DESC`,
    sql`SELECT lower(email) AS email, day, max(percent) AS best FROM results WHERE day >= ${PE_QUIZ_MIN} AND day < 400 GROUP BY lower(email), day`,
  ]);
  return { subs, quizzes };
}

export async function reviewPeSubmission(sql: Sql, email: string, unit: string, status: "approved" | "changes", feedback: string | null, reviewer: string) {
  const rows = await sql`UPDATE pe_submissions SET status = ${status}, feedback = ${feedback}, reviewed_by = ${reviewer}, reviewed_at = now()
    WHERE email = ${email.toLowerCase()} AND unit = ${unit} RETURNING unit`;
  return rows.length > 0;
}

// Documents: the library page lists them; facilitator-only ones are returned only when asked for.
export async function listPeDocs(sql: Sql, withFacilitator: boolean, course = "prompt-engineering") {
  return sql`SELECT slug, title, audience, section FROM pe_docs WHERE course = ${course} AND (audience = 'all' OR ${withFacilitator}) ORDER BY sort`;
}

export async function getPeDoc(sql: Sql, slug: string, withFacilitator: boolean, course = "prompt-engineering") {
  const rows = await sql`SELECT slug, title, audience, section, body FROM pe_docs WHERE slug = ${slug} AND course = ${course} AND (audience = 'all' OR ${withFacilitator})`;
  return rows[0] as { slug: string; title: string; audience: string; section: string; body: string } | undefined;
}

// Titles for a handful of slugs (the links in a unit); slugs that are not loaded are simply missing from the map.
export async function getPeDocTitles(sql: Sql, slugs: string[]) {
  if (!slugs.length) return new Map<string, string>();
  const rows = await sql`SELECT slug, title FROM pe_docs WHERE slug = ANY(${slugs}) AND course = 'prompt-engineering' AND audience = 'all'`;
  return new Map(rows.map((r) => [r.slug as string, r.title as string]));
}
