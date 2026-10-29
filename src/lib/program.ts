// All database reads and writes for the weekly program, so the routes stay thin and the tests run the exact same SQL.
import type { Sql } from "@/lib/assign";

type User = { email: string; name: string };

export async function markComplete(sql: Sql, user: User, activity: string, note: string | null) {
  await sql`INSERT INTO completions (email, name, activity, note) VALUES (${user.email}, ${user.name}, ${activity}, ${note})
    ON CONFLICT (email, activity) DO UPDATE SET note = EXCLUDED.note`;
}

export async function undoComplete(sql: Sql, email: string, activity: string) {
  await sql`DELETE FROM completions WHERE email = ${email} AND activity = ${activity}`;
}

// Levels: week N opens when week N-1 is submitted (a URL was given). Returns the week a person is on (1 to the number of weeks).
export const levelOf = (submittedWeeks: Iterable<number>, weeks = 5) => {
  const done = new Set(submittedWeeks);
  let level = 1;
  while (level < weeks && done.has(level)) level++;
  return level;
};

export async function loadLevel(sql: Sql, email: string) {
  const rows = await sql`SELECT week FROM submissions WHERE email = ${email}`;
  return levelOf(rows.map((r) => r.week as number));
}

export async function saveProof(sql: Sql, email: string, activity: string, mime: string, data: string) {
  await sql`INSERT INTO lab_proofs (email, activity, mime, data) VALUES (${email}, ${activity}, ${mime}, ${data})
    ON CONFLICT (email, activity) DO UPDATE SET mime = EXCLUDED.mime, data = EXCLUDED.data, uploaded_at = now()`;
}

export async function hasProof(sql: Sql, email: string, activity: string) {
  return (await sql`SELECT 1 FROM lab_proofs WHERE email = ${email} AND activity = ${activity}`).length > 0;
}

export async function getProof(sql: Sql, email: string, activity: string) {
  const rows = await sql`SELECT mime, data FROM lab_proofs WHERE email = ${email} AND activity = ${activity}`;
  return rows[0] ? { mime: rows[0].mime as string, data: rows[0].data as string } : null;
}

export type SubmissionInput = { week: number; url: string; challenge: string; solution: string; copilot: string };

export async function saveSubmission(sql: Sql, user: User, s: SubmissionInput) {
  await sql`INSERT INTO submissions (email, name, week, url, challenge, solution, copilot)
    VALUES (${user.email}, ${user.name}, ${s.week}, ${s.url}, ${s.challenge}, ${s.solution}, ${s.copilot})
    ON CONFLICT (email, week) DO UPDATE SET url = EXCLUDED.url, challenge = EXCLUDED.challenge, solution = EXCLUDED.solution,
      copilot = EXCLUDED.copilot, submitted_at = now()`;
}

// Everything one participant has done: for the "My week" page.
export async function loadMine(sql: Sql, email: string) {
  const [completions, submissions, assignments, proofs] = await Promise.all([
    sql`SELECT activity, note FROM completions WHERE email = ${email}`,
    sql`SELECT week, url, challenge, solution, copilot, submitted_at FROM submissions WHERE email = ${email}`,
    sql`SELECT a.week, p.id, p.data FROM assignments a JOIN painpoints p ON p.id = a.pain_point_id WHERE a.email = ${email}`,
    sql`SELECT activity FROM lab_proofs WHERE email = ${email}`,
  ]);
  return { completions, submissions, assignments, proofs };
}

export type RosterInput = { name: string; email: string; team?: string | null; github?: string | null };

export async function addToRoster(sql: Sql, p: RosterInput) {
  await sql`INSERT INTO roster (email, name, team, github_id) VALUES (${p.email.trim().toLowerCase()}, ${p.name.trim()}, ${p.team?.trim() || null}, ${p.github?.trim() || null})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, team = EXCLUDED.team, github_id = EXCLUDED.github_id`;
}

export async function isOnRoster(sql: Sql, email: string) {
  return (await sql`SELECT 1 FROM roster WHERE email = ${email.trim().toLowerCase()}`).length > 0;
}

// Removing a person only hides them from the progress page; their saved work stays in the database.
export async function removeFromRoster(sql: Sql, email: string) {
  await sql`DELETE FROM roster WHERE email = ${email.trim().toLowerCase()}`;
}

// Everything the roster's participants have done: for the facilitator page. Anyone not on the roster (facilitators, testers) is left out.
export async function loadProgress(sql: Sql) {
  const [people, completions, assignments, submissions] = await Promise.all([
    sql`SELECT email, name, team, github_id FROM roster ORDER BY lower(name)`,
    sql`SELECT lower(email) AS email, activity, note, completed_at FROM completions WHERE lower(email) IN (SELECT email FROM roster)`,
    sql`SELECT lower(a.email) AS email, a.week, a.assigned_at, p.id AS pain_point_id, p.data->>'title' AS title, p.data->>'category' AS category
        FROM assignments a JOIN painpoints p ON p.id = a.pain_point_id WHERE lower(a.email) IN (SELECT email FROM roster)`,
    sql`SELECT lower(email) AS email, week, url, challenge, solution, copilot, submitted_at FROM submissions
        WHERE lower(email) IN (SELECT email FROM roster) ORDER BY submitted_at DESC`,
  ]);
  return { people, completions, assignments, submissions };
}
