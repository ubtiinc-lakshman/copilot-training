import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { db } from "@/lib/db";
import { DAYS } from "@/days/registry";
import { isOpen } from "@/lib/schedule";

// POST { day }: records that the signed-in participant opened that day's page (first visit wins).
export async function POST(request: Request) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number((await request.json().catch(() => ({}))).day);
  const entry = DAYS.find((d) => d.day === day);
  if (!entry) return Response.json({ error: "Unknown day" }, { status: 400 });
  if (!isOpen(entry.date) && !(await actingFacilitator(user.email))) return Response.json({ error: "This day has not opened yet" }, { status: 403 });
  const sql = await db();
  await sql`INSERT INTO attendance (email, name, day) VALUES (${user.email.toLowerCase()}, ${user.name ?? user.email}, ${day}) ON CONFLICT DO NOTHING`;
  return Response.json({ ok: true });
}
