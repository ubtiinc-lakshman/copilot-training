import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { todayISO } from "@/lib/schedule";
import { assignPainPoint, type Sql } from "@/lib/assign";
import { currentWeek, WEEKS } from "@/program/calendar";

// POST: gives the signed-in participant this week's pain point, picked at random. Idempotent (a second click returns the same one).
export async function POST() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  let week = currentWeek(todayISO());
  if (week === 0) {
    if (!(await actingFacilitator(user.email))) return Response.json({ error: `Pain points open on ${WEEKS[0].assignOpens}` }, { status: 403 });
    week = 1;
  }

  const result = await assignPainPoint((await db()) as unknown as Sql, user.email, user.name, week);
  if (result.status === "none-left") return Response.json({ error: "No pain points are left for this week. Tell the facilitator." }, { status: 409 });
  if (result.status === "busy") return Response.json({ error: "Busy, please click again." }, { status: 503 });
  return Response.json({ week, painPoint: result.painPoint });
}
