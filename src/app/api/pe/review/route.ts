import { auth, isFacilitator } from "@/auth";
import { db } from "@/lib/db";
import { peUnitIds } from "@/lib/pe";
import { isGtUnit } from "@/lib/gt";
import { reviewPeSubmission } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";

// POST { email, unit, status: "approved" | "changes", feedback? }: a facilitator reviews a lab submission. Sending it back ("changes") needs feedback.
export async function POST(request: Request) {
  const user = (await auth())?.user;
  if (!isFacilitator(user?.email)) return Response.json({ error: "Facilitators only" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const unit = String(body.unit);
  const status = body.status;
  const feedback = typeof body.feedback === "string" && body.feedback.trim() ? body.feedback.trim().slice(0, 2000) : null;
  if (typeof body.email !== "string" || !(peUnitIds.includes(unit) || isGtUnit(unit))) return Response.json({ error: "Unknown submission" }, { status: 400 });
  if (status !== "approved" && status !== "changes") return Response.json({ error: "Status must be approved or changes" }, { status: 400 });
  if (status === "changes" && !feedback) return Response.json({ error: "Say what needs to change" }, { status: 400 });

  const found = await reviewPeSubmission((await db()) as unknown as Sql, body.email, unit, status, feedback, user!.email!.toLowerCase());
  return found ? Response.json({ ok: true }) : Response.json({ error: "No such submission" }, { status: 404 });
}
