import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DAYS } from "@/days/registry";

// POST { day }: records that the signed-in participant opened that day's page (first visit wins).
export async function POST(request: Request) {
  const user = (await auth())?.user;
  if (!user?.email) return Response.json({ error: "Not signed in" }, { status: 401 });
  const day = Number((await request.json().catch(() => ({}))).day);
  if (!DAYS.some((d) => d.day === day)) return Response.json({ error: "Unknown day" }, { status: 400 });
  const sql = await db();
  await sql`INSERT INTO attendance (email, name, day) VALUES (${user.email.toLowerCase()}, ${user.name ?? user.email}, ${day}) ON CONFLICT DO NOTHING`;
  return Response.json({ ok: true });
}
