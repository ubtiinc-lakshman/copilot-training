import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isCorrect, type Given } from "@/lib/grade";
import { getQuiz } from "@/lib/quizzes";

// GET ?day=N: the signed-in person's own attempts at a quiz (newest first), plus the latest answers with a correct/not-correct flag per question.
export async function GET(request: Request) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number(new URL(request.url).searchParams.get("day"));
  const questions = await getQuiz(day);
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 404 });

  const sql = await db();
  const rows = (await sql`SELECT created_at, score, total, percent, answers FROM results WHERE day = ${day} AND email = ${user.email.toLowerCase()} ORDER BY id DESC`) as {
    created_at: string;
    score: number;
    total: number;
    percent: number;
    answers: Given[];
  }[];
  const attempts = rows.map(({ created_at, score, total, percent }) => ({ created_at, score, total, percent }));
  const latest = rows[0];
  // Only reuse stored answers if they still fit the quiz (the questions may have been re-seeded).
  const fits = latest && latest.answers.length === questions.length;
  return Response.json({
    attempts,
    latest: fits ? { answers: latest.answers, correct: questions.map((q, i) => isCorrect(q, latest.answers[i])) } : null,
  });
}
