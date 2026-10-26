import { auth, isFacilitator } from "@/auth";
import { db } from "@/lib/db";
import { addToRoster, removeFromRoster } from "@/lib/program";
import type { Sql } from "@/lib/assign";

// Facilitators only. POST { name, email, team?, github? } adds or updates a participant; DELETE { email } removes one.
async function gate() {
  return isFacilitator((await auth())?.user?.email) ? null : Response.json({ error: "Facilitators only" }, { status: 403 });
}

export async function POST(request: Request) {
  const denied = await gate();
  if (denied) return denied;
  const b = await request.json().catch(() => ({}));
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "A name and a valid email are required" }, { status: 400 });
  await addToRoster((await db()) as unknown as Sql, { name, email, team: b.team, github: b.github });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const denied = await gate();
  if (denied) return denied;
  const b = await request.json().catch(() => ({}));
  if (!b.email) return Response.json({ error: "email required" }, { status: 400 });
  await removeFromRoster((await db()) as unknown as Sql, String(b.email));
  return Response.json({ ok: true });
}
