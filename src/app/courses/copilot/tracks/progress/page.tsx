import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { gtQuizOf, gtTrackOfUnit } from "@/lib/gt";
import { loadGtProgress } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";
import PeReview from "@/components/PeReview";
import { TRACKS } from "@/program/tracks";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Track reviews | GitHub Copilot" };

const LABELS = { did: "What they built or fixed", prompts: "Prompts and features used", validation: "How they checked it" } as const;

// Facilitators only (participant view redirects). Labs waiting for review come first; each shows the commit screenshot link.
async function Reviews() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  if (!(await actingFacilitator(user?.email))) redirect("/courses/copilot");
  const { subs, quizzes, proofs } = await loadGtProgress((await db()) as unknown as Sql);
  const hasProof = new Set(proofs.map((p) => `${p.email}|${p.activity}`));
  const best = new Map(quizzes.map((q) => [`${q.email}|${q.day}`, Number(q.best)]));
  const nameOf = (id: string) => TRACKS.find((t) => t.id === id)?.name ?? id;

  if (!subs.length) return <p className="mt-6 text-muted">No track labs submitted yet.</p>;
  const people = new Map<string, { name: string; work: Record<string, unknown>[] }>();
  for (const s of subs) {
    const p = people.get(s.email as string) ?? { name: s.name as string, work: [] };
    p.work.push(s);
    people.set(s.email as string, p);
  }
  return (
    <div className="mt-6 space-y-4">
      {[...people].map(([email, p]) => (
        <details key={email} className="card p-4" open={p.work.some((w) => w.status === "pending")}>
          <summary className="cursor-pointer text-sm font-semibold">
            {p.name} <span className="font-normal text-muted">({email}) - {p.work.length} lab(s), {p.work.filter((w) => w.status === "pending").length} to review</span>
          </summary>
          <div className="mt-3 space-y-4 text-sm">
            {p.work.map((w) => {
              const unit = w.unit as string;
              const track = gtTrackOfUnit(unit);
              const q = best.get(`${email}|${gtQuizOf(track)}`);
              return (
                <div key={unit} className="rounded-lg border border-line p-3">
                  <p className="font-semibold">
                    <span className={`chip-${w.status === "approved" ? "done" : w.status === "changes" ? "late" : "idle"} mr-2`}>{w.status === "approved" ? "Approved" : w.status === "changes" ? "Sent back" : "To review"}</span>
                    {nameOf(track)}, session {unit.slice(-1)} <span className="font-normal text-muted">| track quiz best {q ?? "-"}%</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold text-muted">Commit screenshot</p>
                  {hasProof.has(`${email}|${unit}`) ? (
                    <a className="link" href={`/api/proof?id=${unit}&email=${encodeURIComponent(email)}`} target="_blank" rel="noreferrer">Open the screenshot</a>
                  ) : (
                    <p className="text-rose-600">Missing</p>
                  )}
                  {Object.entries(LABELS).map(([k, label]) => {
                    const v = (w.fields as Record<string, string>)[k];
                    return v ? (
                      <div key={k} className="mt-2">
                        <p className="text-xs font-semibold text-muted">{label}</p>
                        <p className="whitespace-pre-wrap">{v}</p>
                      </div>
                    ) : null;
                  })}
                  <PeReview email={email} unit={unit} status={w.status as string} feedback={(w.feedback as string | null) ?? null} />
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}

export default function TrackReviewsPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot/tracks" className="link text-sm">
        Team tracks
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Track lab reviews</h1>
      <p className="text-muted">Approve a lab or send it back with feedback. A lab that is sent back does not count toward the track until it is resubmitted.</p>
      <Suspense fallback={<PageSkeleton />}>
        <Reviews />
      </Suspense>
    </main>
  );
}
