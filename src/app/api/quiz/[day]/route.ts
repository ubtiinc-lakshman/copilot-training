import { auth } from "@/auth";
import { DAYS } from "@/days/registry";
import { getQuiz, toPublic } from "@/lib/quizzes";
import { isLessonOpen } from "@/lib/schedule";
import { actingFacilitator } from "@/lib/viewMode";

// GET: the quiz for an open day, without answers. Facilitators (not in participant view) also get the answer text.
export async function GET(_req: Request, { params }: { params: Promise<{ day: string }> }) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number((await params).day);
  const entry = DAYS.find((d) => d.day === day);
  const facilitator = await actingFacilitator(user.email);
  if (!entry || (!isLessonOpen() && !facilitator)) return Response.json({ error: "Not available" }, { status: 404 });
  const questions = await getQuiz(entry.day);
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 404 });
  return Response.json({ questions: toPublic(questions, facilitator) });
}
