import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { gtTrackOfUnit, isGtUnit } from "@/lib/gt";
import { isEnrolledIn, isGtOpen } from "@/lib/gtDb";
import { hasProof } from "@/lib/program";
import { savePeSubmission, type PeFields } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";

const text = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 6000) : "");
const FIELDS = ["did", "prompts", "validation"] as const;

// POST { unit, did, prompts, validation }: the lab for one track session. A screenshot of the git commit must be uploaded first (/api/proof).
// Resubmitting replaces the earlier lab and puts it back in the review queue.
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const unit = String(body.unit);
  if (!isGtUnit(unit)) return Response.json({ error: "Unknown session" }, { status: 400 });

  const sql = (await db()) as unknown as Sql;
  if (!(await actingFacilitator(user.email)) && !(await isGtOpen(sql, user.email))) return Response.json({ error: "Complete the Day 7 gate first" }, { status: 403 });
  if (!(await actingFacilitator(user.email)) && !(await isEnrolledIn(sql, user.email, gtTrackOfUnit(unit)))) return Response.json({ error: "This is not your track. Pick your track first." }, { status: 403 });
  if (!(await hasProof(sql, user.email, unit))) return Response.json({ error: "Upload a screenshot of your git commit first" }, { status: 400 });

  const fields = Object.fromEntries(FIELDS.map((f) => [f, text(body[f])]));
  const missing = FIELDS.filter((f) => !fields[f]);
  if (missing.length) return Response.json({ error: `Fill in: ${missing.join(", ")}` }, { status: 400 });

  await savePeSubmission(sql, user, unit, fields as unknown as PeFields);
  return Response.json({ ok: true });
}
