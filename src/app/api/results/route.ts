import { getDb, type ResultRow } from "@/lib/db";
import { gradeQuiz, type Given } from "@/lib/grade";
import { QUIZZES } from "@/days/assessments";

// POST: a participant submits quiz answers. The score is recomputed here, never trusted from the browser.
export async function POST(request: Request) {
  let body: { day?: unknown; name?: unknown; answers?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const day = Number(body.day);
  const questions = QUIZZES[day];
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 400 });
  if (name.length < 1 || name.length > 80) return Response.json({ error: "Name is required (max 80 characters)" }, { status: 400 });
  if (!Array.isArray(body.answers) || body.answers.length !== questions.length) {
    return Response.json({ error: "answers must match the number of questions" }, { status: 400 });
  }
  const answers = body.answers.map((a): Given => (typeof a === "string" ? a.slice(0, 500) : (a as Given)));

  const { score, total, percent } = gradeQuiz(questions, answers);
  getDb()
    .prepare("INSERT INTO results (day, name, score, total, percent, answers) VALUES (?, ?, ?, ?, ?, ?)")
    .run(day, name, score, total, percent, JSON.stringify(answers));
  return Response.json({ score, total, percent });
}

// GET: facilitator only. Send the key in the x-facilitator-key header (env FACILITATOR_KEY).
export async function GET(request: Request) {
  const key = process.env.FACILITATOR_KEY;
  if (!key) return Response.json({ error: "FACILITATOR_KEY is not set on the server" }, { status: 503 });
  if (request.headers.get("x-facilitator-key") !== key) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = getDb()
    .prepare("SELECT id, created_at, day, name, score, total, percent FROM results ORDER BY id DESC")
    .all() as ResultRow[];
  return Response.json({ rows });
}
