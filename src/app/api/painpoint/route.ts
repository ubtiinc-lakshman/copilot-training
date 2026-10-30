import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { assignPainPoint, type Sql } from "@/lib/assign";
import { isOnRoster, loadLevel } from "@/lib/program";
import { isStage3Open } from "@/lib/gtDb";
import { actingFacilitator } from "@/lib/viewMode";

// POST: gives the signed-in participant the pain point for the week you are on, picked at random. Idempotent (a second click returns the same one).
export async function POST() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const sql = (await db()) as unknown as Sql;
  if (!(await isOnRoster(sql, user.email))) return Response.json({ error: "You are not on the participant list. Ask the facilitator to add you." }, { status: 403 });

  if (!(await actingFacilitator(user.email)) && !(await isStage3Open(sql, user.email))) return Response.json({ error: "Finish your team track first" }, { status: 403 });

  const week = await loadLevel(sql, user.email); // the week you are on: you move up by submitting the previous app

  const result = await assignPainPoint(sql, user.email, user.name, week);
  if (result.status === "none-left") return Response.json({ error: "No pain points are left for this week. Tell the facilitator." }, { status: 409 });
  if (result.status === "busy") return Response.json({ error: "Busy, please click again." }, { status: 503 });
  return Response.json({ week, painPoint: result.painPoint });
}
