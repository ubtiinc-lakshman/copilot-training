import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { isOpen } from "@/lib/schedule";
import { getEvent } from "@/program/calendar";
import { getCommonDay } from "@/program/common";
import { DAYS } from "@/days/registry";
import { hasProof, loadLevel, markComplete, undoComplete } from "@/lib/program";
import type { Sql } from "@/lib/assign";

// POST { id, note?, done? }: the signed-in participant marks a lab/call as completed (done: false undoes it).
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id);
  // "lab-N" is the lab task of library lesson N (always open). "c0".."c7" are the dated common days. Anything else is a weekly program
  // activity, which is self-paced: week N opens when week N-1 has been submitted, and session labs need a screenshot of the git commit.
  const lesson = /^lab-(\d+)$/.exec(id);
  const common = getCommonDay(id);
  const weekly = lesson || common ? undefined : getEvent(id);
  if (lesson ? !DAYS.some((d) => d.day === Number(lesson[1])) : !common && (!weekly || weekly.kind === "submit")) return Response.json({ error: "Unknown activity" }, { status: 400 });
  const facilitator = await actingFacilitator(user.email);
  if (common && !isOpen(common.date) && !facilitator) return Response.json({ error: "This activity has not opened yet" }, { status: 403 });

  const sql = (await db()) as unknown as Sql;
  if (weekly && !facilitator && weekly.week > (await loadLevel(sql, user.email))) return Response.json({ error: `Submit your week ${weekly.week - 1} app first` }, { status: 403 });
  if (body.done === false) {
    await undoComplete(sql, user.email, id);
    return Response.json({ done: false });
  }
  if ((lesson || weekly?.kind === "session") && !(await hasProof(sql, user.email, id))) return Response.json({ error: "Upload a screenshot of your git commit first" }, { status: 400 });
  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 500) : null;
  await markComplete(sql, user, id, note);
  return Response.json({ done: true, note });
}
