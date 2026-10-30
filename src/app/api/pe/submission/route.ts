import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { peUnitIds } from "@/lib/pe";
import { loadPeLevel, savePeSubmission, PE_FIELDS, type PeFields } from "@/lib/peDb";
import { getUnit } from "@/program/pe";
import type { Sql } from "@/lib/assign";

const text = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 6000) : "");

// POST { unit, scenario?, initial, refined, output, validation }: the lab submission for a unit (resubmitting replaces it).
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const unit = String(body.unit);
  const info = peUnitIds.includes(unit) ? getUnit(unit) : undefined;
  if (!info) return Response.json({ error: "Unknown unit" }, { status: 400 });

  const sql = (await db()) as unknown as Sql;
  if (info.level > (await loadPeLevel(sql, user.email)) && !(await actingFacilitator(user.email))) return Response.json({ error: `Finish level ${info.level - 1} first` }, { status: 403 });

  const fields = Object.fromEntries(PE_FIELDS.map((f) => [f, text(body[f])])) as PeFields;
  const required = (unit === "l3" ? PE_FIELDS : PE_FIELDS.filter((f) => f !== "scenario")).filter((f) => !fields[f]);
  if (required.length) return Response.json({ error: `Fill in: ${required.join(", ")}` }, { status: 400 });

  await savePeSubmission(sql, user, unit, fields);
  return Response.json({ ok: true });
}
