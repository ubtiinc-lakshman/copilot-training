import { auth, isFacilitator } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { db, type AttendanceRow, type LabRow, type ResultRow } from "@/lib/db";
import { gradeQuiz, isCorrect, type Given } from "@/lib/grade";
import { getQuiz } from "@/lib/quizzes";
import { commonQuizDay, isOpen, quizOpen } from "@/lib/schedule";
import { getCommonDay } from "@/program/common";
import { getEvent } from "@/program/calendar";
import { PE_QUIZ_MIN, peLevelOfQuiz } from "@/lib/pe";
import { loadPeLevel } from "@/lib/peDb";
import { GT_QUIZ_MIN, gtTrackOfQuiz } from "@/lib/gt";
import { isEnrolledIn } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";

// POST: a signed-in participant submits quiz answers. The score is recomputed here, never trusted from the browser.
export async function POST(request: Request) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });

  let body: { day?: unknown; answers?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const day = Number(body.day);
  const questions = await getQuiz(day);
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 400 });
  const commonDay = commonQuizDay(day);
  if (commonDay !== undefined) {
    if (!(await actingFacilitator(user.email)) && !isOpen(getCommonDay(`c${commonDay}`)!.date)) return Response.json({ error: "This day has not opened yet" }, { status: 403 });
  } else if (day > GT_QUIZ_MIN && day < GT_QUIZ_MIN + 100) {
    const track = gtTrackOfQuiz(day);
    if (!(await actingFacilitator(user.email)) && (!track || !(await isEnrolledIn((await db()) as unknown as Sql, user.email.toLowerCase(), track)))) return Response.json({ error: "This is not your track" }, { status: 403 });
  } else if (day >= PE_QUIZ_MIN) {
    if (!(await actingFacilitator(user.email)) && peLevelOfQuiz(day) > (await loadPeLevel((await db()) as unknown as Sql, user.email.toLowerCase()))) return Response.json({ error: "This level has not opened yet" }, { status: 403 });
  } else if (!quizOpen(day, day > 100 ? getEvent(`s${String(day - 100).padStart(2, "0")}`)?.date : undefined) && !(await actingFacilitator(user.email))) return Response.json({ error: "This day has not opened yet" }, { status: 403 });
  if (!Array.isArray(body.answers) || body.answers.length !== questions.length) {
    return Response.json({ error: "answers must match the number of questions" }, { status: 400 });
  }
  const answers = body.answers.map((a): Given => (typeof a === "string" ? a.slice(0, 500) : (a as Given)));

  const { score, total, percent } = gradeQuiz(questions, answers);
  const sql = await db();
  await sql`INSERT INTO results (day, email, name, score, total, percent, answers)
    VALUES (${day}, ${user.email.toLowerCase()}, ${user.name ?? user.email}, ${score}, ${total}, ${percent}, ${JSON.stringify(answers)}::jsonb)`;
  return Response.json({ score, total, percent, correct: questions.map((q, i) => isCorrect(q, answers[i])) });
}

// GET: facilitators only (FACILITATOR_EMAILS).
export async function GET() {
  if (!isFacilitator((await auth())?.user?.email)) return Response.json({ error: "Facilitators only" }, { status: 403 });
  const sql = await db();
  const rows = (await sql`SELECT id, created_at, day, email, name, score, total, percent FROM results WHERE day < ${PE_QUIZ_MIN} ORDER BY id DESC`) as ResultRow[];
  const attendance = (await sql`SELECT email, name, day FROM attendance`) as AttendanceRow[];
  const labs = ((await sql`SELECT c.email, c.name, c.activity, c.note, c.completed_at,
      EXISTS (SELECT 1 FROM lab_proofs p WHERE p.email = c.email AND p.activity = c.activity) AS proof
    FROM completions c WHERE c.activity LIKE 'lab-%'`) as (Omit<LabRow, "day"> & { activity: string })[]).map(
    ({ activity, ...r }) => ({ ...r, day: Number(activity.slice(4)) }),
  );
  const roster = (await sql`SELECT lower(email) AS email, name FROM roster ORDER BY lower(name)`) as { email: string; name: string }[];
  return Response.json({ rows, attendance, labs, roster });
}
