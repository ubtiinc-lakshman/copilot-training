import { auth } from "@/auth";
import { DAYS } from "@/days/registry";
import { getQuiz, toPublic } from "@/lib/quizzes";
import { quizOpen } from "@/lib/schedule";
import { getEvent } from "@/program/calendar";
import { actingFacilitator } from "@/lib/viewMode";

// GET: the quiz for an open day, without answers. Facilitators (not in participant view) also get the answer text.
export async function GET(_req: Request, { params }: { params: Promise<{ day: string }> }) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number((await params).day);
  const sessionDate = day > 100 ? getEvent(`s${String(day - 100).padStart(2, "0")}`)?.date : undefined;
  const entry = day > 100 ? (sessionDate ? { day } : undefined) : DAYS.find((d) => d.day === day);
  const facilitator = await actingFacilitator(user.email);
  if (!entry || (!quizOpen(day, sessionDate) && !facilitator)) return Response.json({ error: "Not available" }, { status: 404 });
  const questions = await getQuiz(entry.day);
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 404 });
  return Response.json({ questions: toPublic(questions, facilitator) });
}
