import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { getEvent } from "@/program/calendar";
import { DAYS } from "@/days/registry";
import { getProof, loadLevel, saveProof } from "@/lib/program";
import type { Sql } from "@/lib/assign";

const TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 3 * 1024 * 1024; // the request body limit on Vercel is 4.5 MB

// POST (form data: id, file): the screenshot of the git commit that proves a weekly session lab. Replaces an earlier one.
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const id = String(form?.get("id") ?? "");
  const file = form?.get("file");
  const event = getEvent(id);
  const lesson = /^lab-(\d+)$/.exec(id); // library lesson lab
  if (lesson ? !DAYS.some((d) => d.day === Number(lesson[1])) : event?.kind !== "session") return Response.json({ error: "Unknown lab" }, { status: 400 });
  if (!(file instanceof File)) return Response.json({ error: "Choose a screenshot" }, { status: 400 });
  if (!TYPES.includes(file.type)) return Response.json({ error: "Upload a PNG, JPG or WebP image" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "The image is over 3 MB. Crop the screenshot to the commit." }, { status: 400 });

  const sql = (await db()) as unknown as Sql;
  if (event && event.week > (await loadLevel(sql, user.email)) && !(await actingFacilitator(user.email))) {
    return Response.json({ error: `Submit your week ${event.week - 1} app first` }, { status: 403 });
  }
  await saveProof(sql, user.email, id, file.type, Buffer.from(await file.arrayBuffer()).toString("base64"));
  return Response.json({ ok: true });
}

// GET ?id=s03[&email=x]: the screenshot. You can see your own; facilitators can see anyone's.
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const url = new URL(request.url);
  const email = (url.searchParams.get("email") ?? user.email).toLowerCase();
  if (email !== user.email && !(await actingFacilitator(user.email))) return Response.json({ error: "Not allowed" }, { status: 403 });

  const proof = await getProof((await db()) as unknown as Sql, email, url.searchParams.get("id") ?? "");
  if (!proof) return Response.json({ error: "No screenshot" }, { status: 404 });
  return new Response(Buffer.from(proof.data, "base64"), {
    headers: { "content-type": proof.mime, "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; sandbox", "cache-control": "private, no-store" },
  });
}
