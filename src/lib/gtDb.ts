// Database reads for the GitHub Copilot team tracks. Submissions share the table pe_submissions (units "gt-<track>-<n>"), proofs share lab_proofs.
import type { Sql } from "@/lib/assign";
import { GT_QUIZ_MIN, GT_UNLOCK_ACTIVITY, gtStage3Open } from "@/lib/gt";
import { PE_PASS_PERCENT } from "@/lib/pe";

export async function loadGtState(sql: Sql, email: string) {
  const [gate, subs, quizzes, proofs, enrol, started] = await Promise.all([
    sql`SELECT 1 FROM completions WHERE email = ${email} AND activity = ${GT_UNLOCK_ACTIVITY}`,
    sql`SELECT unit, fields, submitted_at, status, feedback FROM pe_submissions WHERE email = ${email} AND unit LIKE 'gt-%'`,
    sql`SELECT day, max(percent) AS best FROM results WHERE email = ${email} AND day > ${GT_QUIZ_MIN} AND day < ${GT_QUIZ_MIN + 100} GROUP BY day`,
    sql`SELECT activity FROM lab_proofs WHERE email = ${email} AND activity LIKE 'gt-%'`,
    sql`SELECT track, set_by FROM gt_enrollment WHERE email = ${email}`,
    sql`SELECT 1 FROM assignments WHERE email = ${email} UNION ALL SELECT 1 FROM submissions WHERE email = ${email}`,
  ]);
  const submittedUnits = subs.filter((s) => s.status !== "changes").map((s) => s.unit as string);
  const passedQuizzes = quizzes.filter((q) => Number(q.best) >= PE_PASS_PERCENT).map((q) => Number(q.day));
  const track = (enrol[0]?.track as string | undefined) ?? null;
  return {
    track,
    // Stage 3 (weekly apps): the enrolled track is done, or the person had already started the weekly apps.
    stage3: gtStage3Open(track, new Set(submittedUnits), new Set(passedQuizzes), started.length > 0),
    open: gate.length > 0,
    subs,
    // A lab sent back for changes does not count until it is resubmitted.
    submitted: subs.filter((s) => s.status !== "changes").map((s) => s.unit as string),
    passed: quizzes.filter((q) => Number(q.best) >= PE_PASS_PERCENT).map((q) => Number(q.day)),
    best: Object.fromEntries(quizzes.map((q) => [Number(q.day), Number(q.best)])),
    proofs: new Set(proofs.map((p) => p.activity as string)),
  };
}

export async function isGtOpen(sql: Sql, email: string) {
  return (await sql`SELECT 1 FROM completions WHERE email = ${email} AND activity = ${GT_UNLOCK_ACTIVITY}`).length > 0;
}

// Everyone's track work, for the facilitator page.
export async function loadGtProgress(sql: Sql) {
  const [subs, quizzes, proofs] = await Promise.all([
    sql`SELECT lower(email) AS email, name, unit, fields, submitted_at, status, feedback FROM pe_submissions WHERE unit LIKE 'gt-%' ORDER BY (status = 'pending') DESC, submitted_at DESC`,
    sql`SELECT lower(email) AS email, day, max(percent) AS best FROM results WHERE day > ${GT_QUIZ_MIN} AND day < ${GT_QUIZ_MIN + 100} GROUP BY lower(email), day`,
    sql`SELECT lower(email) AS email, activity FROM lab_proofs WHERE activity LIKE 'gt-%'`,
  ]);
  return { subs, quizzes, proofs };
}

export async function setEnrollment(sql: Sql, email: string, track: string, setBy: string) {
  await sql`INSERT INTO gt_enrollment (email, track, set_by) VALUES (${email}, ${track}, ${setBy})
    ON CONFLICT (email) DO UPDATE SET track = EXCLUDED.track, set_by = EXCLUDED.set_by, set_at = now()`;
}

export async function getEnrollment(sql: Sql, email: string) {
  const rows = await sql`SELECT track, set_by FROM gt_enrollment WHERE email = ${email}`;
  return rows[0] ? { track: rows[0].track as string, setBy: rows[0].set_by as string } : null;
}

// Can this person do work in this track? Only the track they are enrolled in (facilitators are checked by the caller).
export async function isEnrolledIn(sql: Sql, email: string, track: string) {
  return (await getEnrollment(sql, email))?.track === track;
}

export async function isStage3Open(sql: Sql, email: string) {
  return (await loadGtState(sql, email)).stage3;
}

// The facilitator view: every roster member with their stage, enrolled track and lab/quiz progress.
export async function loadGtRoster(sql: Sql) {
  const [people, enrol, subs, quizzes, gate, started] = await Promise.all([
    sql`SELECT lower(email) AS email, name, team FROM roster ORDER BY lower(name)`,
    sql`SELECT lower(email) AS email, track, set_by FROM gt_enrollment`,
    sql`SELECT lower(email) AS email, unit, status FROM pe_submissions WHERE unit LIKE 'gt-%'`,
    sql`SELECT lower(email) AS email, day, max(percent) AS best FROM results WHERE day > ${GT_QUIZ_MIN} AND day < ${GT_QUIZ_MIN + 100} GROUP BY lower(email), day`,
    sql`SELECT lower(email) AS email FROM completions WHERE activity = ${GT_UNLOCK_ACTIVITY}`,
    sql`SELECT lower(email) AS email FROM submissions UNION SELECT lower(email) FROM assignments`,
  ]);
  return { people, enrol, subs, quizzes, gate: new Set(gate.map((g) => g.email as string)), started: new Set(started.map((s) => s.email as string)) };
}
