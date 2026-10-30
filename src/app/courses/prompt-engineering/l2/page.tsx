import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { peUnitDone } from "@/lib/pe";
import { loadPeState } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import { TRACKS } from "@/program/pe";

export const metadata = { title: "Level 2 | Prompt Engineering" };

async function Tracks() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const facilitator = await actingFacilitator(user?.email);
  const state = user ? await loadPeState((await db()) as unknown as Sql, user.email) : null;
  const submitted = new Set(state?.submitted ?? []);
  const passed = new Set(state?.passed ?? []);

  if (!facilitator && (state?.level ?? 1) < 2) {
    return (
      <div className="card mt-6 p-6 text-sm">
        <p className="font-semibold">Level 2 is locked</p>
        <p className="mt-1 text-muted">Submit the Level 1 lab and pass its quiz first.</p>
        <Link href="/courses/prompt-engineering/l1" className="link mt-3 inline-block">
          Go to Level 1
        </Link>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {TRACKS.map((t) => (
        <Link key={t.id} href={`/courses/prompt-engineering/l2/${t.id}`} className="card block p-5 hover:border-brand">
          <span className={peUnitDone(`l2-${t.id}`, submitted, passed) ? "chip-done" : "chip-idle"}>{peUnitDone(`l2-${t.id}`, submitted, passed) ? "Done" : submitted.has(`l2-${t.id}`) ? "Lab submitted" : "Not started"}</span>
          <h2 className="mt-3 text-lg font-bold">{t.label}</h2>
          <p className="mt-1 text-sm text-muted">{t.audience}</p>
          <p className="mt-2 text-sm">{t.objective}</p>
        </Link>
      ))}
    </div>
  );
}

export default function Level2Page() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering" className="link text-sm">
        Prompt Engineering
      </Link>
      <h1 className="mb-2 mt-3 text-3xl font-extrabold tracking-tight">Level 2: Your team track</h1>
      <p className="text-muted">Pick the track that matches your work. Finishing one track opens Level 3; you can do more than one.</p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Tracks />
      </Suspense>
    </main>
  );
}
