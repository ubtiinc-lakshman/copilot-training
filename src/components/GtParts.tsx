import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { loadGtState } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";

// Who is looking, and what they have done in the Copilot tracks. `allowed` = Stage 2 is open for them (Day 7 gate done, or facilitator).
export async function gtViewer() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const facilitator = await actingFacilitator(user?.email);
  const state = user ? await loadGtState((await db()) as unknown as Sql, user.email) : null;
  return { user, facilitator, state, allowed: facilitator || !!state?.open };
}

// Shown when someone opens a track that is not theirs (or has not picked one yet).
export function GtNotYours({ mine }: { mine: string | null }) {
  return (
    <div className="card mt-6 p-6 text-sm">
      <p className="font-semibold">{mine ? "This is not your track" : "Pick your track first"}</p>
      <p className="mt-1 text-muted">{mine ? "You can only work in the track you started. Ask a facilitator if it should be changed." : "Choose the track for your team on the Team tracks page."}</p>
      <Link href="/courses/copilot/tracks" className="link mt-3 inline-block">
        Go to Team tracks
      </Link>
    </div>
  );
}

export function GtLocked() {
  return (
    <div className="card mt-6 p-6 text-sm">
      <p className="font-semibold">Stage 2 (team tracks) opens after the Day 7 gate</p>
      <p className="mt-1 text-muted">Take the Day 7 gate on the Common days page and mark it complete. Your track opens right after.</p>
      <Link href="/courses/copilot/common" className="link mt-3 inline-block">
        Go to Common days
      </Link>
    </div>
  );
}
