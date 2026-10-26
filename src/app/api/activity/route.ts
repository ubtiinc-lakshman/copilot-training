import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { isOpen } from "@/lib/schedule";
import { getEvent } from "@/program/calendar";
import { DAYS } from "@/days/registry";
import { markComplete, undoComplete } from "@/lib/program";
import type { Sql } from "@/lib/assign";

// POST { id, note?, done? }: the signed-in participant marks a lab/call as completed (done: false undoes it).
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  // "lab-N" is the lab task of library lesson N (lessons are always open); anything else is a weekly program activity.
  const lesson = /^lab-(\d+)$/.exec(String(body.id));
  const event = lesson ? (DAYS.some((d) => d.day === Number(lesson[1])) ? { id: lesson[0], date: "" } : undefined) : getEvent(String(body.id));
  if (!event || ("kind" in event && event.kind === "submit")) return Response.json({ error: "Unknown activity" }, { status: 400 });
  if (!lesson && !isOpen(event.date) && !(await actingFacilitator(user.email))) return Response.json({ error: "This activity has not opened yet" }, { status: 403 });

  const sql = (await db()) as unknown as Sql;
  if (body.done === false) {
    await undoComplete(sql, user.email, event.id);
    return Response.json({ done: false });
  }
  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 500) : null;
  await markComplete(sql, user, event.id, note);
  return Response.json({ done: true, note });
}
