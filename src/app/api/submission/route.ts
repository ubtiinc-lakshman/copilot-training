import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { todayISO } from "@/lib/schedule";
import { getWeek } from "@/program/calendar";
import { saveSubmission } from "@/lib/program";
import type { Sql } from "@/lib/assign";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// POST { week, url, challenge, solution, copilot }: the weekly submission (resubmitting replaces it until the facilitator reviews).
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const week = Number(body.week);
  const info = getWeek(week);
  if (!info) return Response.json({ error: "Unknown week" }, { status: 400 });
  if (todayISO() < info.assignOpens && !(await actingFacilitator(user.email))) return Response.json({ error: "This week has not started" }, { status: 403 });

  let url: URL;
  try {
    url = new URL(text(body.url, 500));
  } catch {
    return Response.json({ error: "Enter the full Vercel URL, starting with https://" }, { status: 400 });
  }
  if (url.protocol !== "https:") return Response.json({ error: "The URL must start with https://" }, { status: 400 });

  const challenge = text(body.challenge, 2000);
  const solution = text(body.solution, 2000);
  const copilot = text(body.copilot, 2000);
  if (!challenge || !solution || !copilot) return Response.json({ error: "Fill in the challenge, how you solved it, and how you used Copilot" }, { status: 400 });

  await saveSubmission((await db()) as unknown as Sql, user, { week, url: url.href, challenge, solution, copilot });
  return Response.json({ ok: true, late: todayISO() > info.due });
}
