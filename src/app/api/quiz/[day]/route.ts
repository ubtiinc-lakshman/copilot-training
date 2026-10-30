import { auth } from "@/auth";
import { DAYS } from "@/days/registry";
import { getQuiz, toPublic } from "@/lib/quizzes";
import { commonQuizDay, isOpen, quizOpen } from "@/lib/schedule";
import { getCommonDay } from "@/program/common";
import { getEvent } from "@/program/calendar";
import { actingFacilitator } from "@/lib/viewMode";
import { db } from "@/lib/db";
import { PE_QUIZ_MIN, peLevelOfQuiz } from "@/lib/pe";
import { loadPeLevel } from "@/lib/peDb";
import { GT_QUIZ_MIN, gtTrackOfQuiz } from "@/lib/gt";
import { isEnrolledIn, isGtOpen } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";

// GET: the quiz for an open day, without answers. Facilitators (not in participant view) also get the answer text.
export async function GET(_req: Request, { params }: { params: Promise<{ day: string }> }) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number((await params).day);
  if (day > GT_QUIZ_MIN && day < GT_QUIZ_MIN + 100) {
    // GitHub Copilot track quizzes open with Level 2 (the Day 7 gate).
    const trackSql = (await db()) as unknown as Sql;
    const track = gtTrackOfQuiz(day);
    if (!(await actingFacilitator(user.email)) && (!track || !(await isEnrolledIn(trackSql, user.email.toLowerCase(), track)))) return Response.json({ error: "Not your track" }, { status: 403 });
    const questions = await getQuiz(day);
    return questions ? Response.json({ questions: toPublic(questions, await actingFacilitator(user.email)) }) : Response.json({ error: "No quiz for that day" }, { status: 404 });
  }
  if (day >= PE_QUIZ_MIN) {
    // Prompt Engineering quizzes open with the level they belong to.
    if (!(await actingFacilitator(user.email)) && peLevelOfQuiz(day) > (await loadPeLevel((await db()) as unknown as Sql, user.email.toLowerCase()))) return Response.json({ error: "Not available yet" }, { status: 403 });
    const questions = await getQuiz(day);
    return questions ? Response.json({ questions: toPublic(questions, await actingFacilitator(user.email)) }) : Response.json({ error: "No quiz for that day" }, { status: 404 });
  }
  const commonDay = commonQuizDay(day);
  if (commonDay !== undefined) {
    // Common-day quizzes open on the date of the day (facilitators any time).
    const facilitator = await actingFacilitator(user.email);
    if (!facilitator && !isOpen(getCommonDay(`c${commonDay}`)!.date)) return Response.json({ error: "Not available yet" }, { status: 403 });
    const questions = await getQuiz(day);
    return questions ? Response.json({ questions: toPublic(questions, facilitator) }) : Response.json({ error: "No quiz for that day" }, { status: 404 });
  }
  const sessionDate = day > 100 ? getEvent(`s${String(day - 100).padStart(2, "0")}`)?.date : undefined;
  const entry = day > 100 ? (sessionDate ? { day } : undefined) : DAYS.find((d) => d.day === day);
  const facilitator = await actingFacilitator(user.email);
  if (!entry || (!quizOpen(day, sessionDate) && !facilitator)) return Response.json({ error: "Not available" }, { status: 404 });
  const questions = await getQuiz(entry.day);
  if (!questions) return Response.json({ error: "No quiz for that day" }, { status: 404 });
  return Response.json({ questions: toPublic(questions, facilitator) });
}
