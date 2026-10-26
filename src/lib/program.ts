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

export type SubmissionInput = { week: number; url: string; challenge: string; solution: string; copilot: string };

export async function saveSubmission(sql: Sql, user: User, s: SubmissionInput) {
  await sql`INSERT INTO submissions (email, name, week, url, challenge, solution, copilot)
    VALUES (${user.email}, ${user.name}, ${s.week}, ${s.url}, ${s.challenge}, ${s.solution}, ${s.copilot})
    ON CONFLICT (email, week) DO UPDATE SET url = EXCLUDED.url, challenge = EXCLUDED.challenge, solution = EXCLUDED.solution,
      copilot = EXCLUDED.copilot, submitted_at = now()`;
}

// Everything one participant has done: for the "My week" page.
export async function loadMine(sql: Sql, email: string) {
  const [completions, submissions, assignments] = await Promise.all([
    sql`SELECT activity, note FROM completions WHERE email = ${email}`,
    sql`SELECT week, url, challenge, solution, copilot, submitted_at FROM submissions WHERE email = ${email}`,
    sql`SELECT a.week, p.id, p.data FROM assignments a JOIN painpoints p ON p.id = a.pain_point_id WHERE a.email = ${email}`,
  ]);
  return { completions, submissions, assignments };
}

// Everything every participant has done: for the facilitator page.
export async function loadProgress(sql: Sql) {
  const [people, completions, assignments, submissions] = await Promise.all([
    sql`SELECT email, max(name) AS name FROM (
          SELECT email, name FROM attendance UNION ALL SELECT email, name FROM completions UNION ALL
          SELECT email, name FROM assignments UNION ALL SELECT email, name FROM submissions UNION ALL SELECT email, name FROM results
        ) t GROUP BY email ORDER BY max(name)`,
    sql`SELECT email, activity, note, completed_at FROM completions`,
    sql`SELECT a.email, a.week, a.assigned_at, p.id AS pain_point_id, p.data->>'title' AS title, p.data->>'category' AS category
        FROM assignments a JOIN painpoints p ON p.id = a.pain_point_id`,
    sql`SELECT email, week, url, challenge, solution, copilot, submitted_at FROM submissions ORDER BY submitted_at DESC`,
  ]);
  return { people, completions, assignments, submissions };
}
