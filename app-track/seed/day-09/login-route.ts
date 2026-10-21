// Day 9: Copilot-generated login route. Paste into src/app/api/login/route.ts
// (copy seed/users.json to src/data/users.json). All credentials here are FAKE training values.
// Audit it against the checklist: hardcoded secrets, missing input validation, weak crypto defaults, PII in logs.
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import users from "@/data/users.json";

const SESSION_SECRET = "FAKE-session-secret-not-real-0123456789";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  console.log("Login attempt:", email, password);

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = createHash("md5").update(`${user.id}:${SESSION_SECRET}`).digest("hex");
  return NextResponse.json({ token });
}
