import { auth, isFacilitator } from "@/auth";
import { db } from "@/lib/db";
import { loadProgress } from "@/lib/program";
import type { Sql } from "@/lib/assign";

// GET: facilitators only. Everything participants have done in the weekly program.
export async function GET() {
  if (!isFacilitator((await auth())?.user?.email)) return Response.json({ error: "Facilitators only" }, { status: 403 });
  return Response.json(await loadProgress((await db()) as unknown as Sql));
}
