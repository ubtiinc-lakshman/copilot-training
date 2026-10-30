import { auth, isFacilitator } from "@/auth";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { GT_TRACKS } from "@/lib/gt";
import { getEnrollment, isGtOpen, setEnrollment } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";

// POST { track }: the signed-in person picks their team track. It can be done once; after that only a facilitator can change it.
// POST { track, email }: a facilitator assigns or changes the track of someone else.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const track = String(body.track);
  if (!(GT_TRACKS as readonly string[]).includes(track)) return Response.json({ error: "Unknown track" }, { status: 400 });
  const sql = (await db()) as unknown as Sql;

  if (typeof body.email === "string") {
    const me = (await auth())?.user;
    if (!isFacilitator(me?.email)) return Response.json({ error: "Facilitators only" }, { status: 403 });
    await setEnrollment(sql, body.email.trim().toLowerCase(), track, `facilitator:${me!.email!.toLowerCase()}`);
    return Response.json({ ok: true });
  }

  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isGtOpen(sql, user.email))) return Response.json({ error: "Complete the Day 7 gate first" }, { status: 403 });
  const current = await getEnrollment(sql, user.email);
  if (current && current.track !== track) return Response.json({ error: "You are already on a track. Ask a facilitator to change it." }, { status: 409 });
  await setEnrollment(sql, user.email, track, "self");
  return Response.json({ ok: true });
}
