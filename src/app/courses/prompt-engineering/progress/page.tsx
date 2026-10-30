import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { PE_PASS_PERCENT, peLevel, peQuizOf } from "@/lib/pe";
import { loadPeProgress } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import PeReview from "@/components/PeReview";
import { allUnits } from "@/program/pe";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Progress | Prompt Engineering" };

const LABELS = { scenario: "Scenario", initial: "Initial prompt", refined: "Refined prompt", output: "Output summary", validation: "Validation notes" } as const;

// Facilitators only (participant view redirects to the course overview). Everyone who has started shows up, with their submitted labs.
async function Progress() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  if (!(await actingFacilitator(user?.email))) redirect("/courses/prompt-engineering");
  const { subs, quizzes } = await loadPeProgress((await db()) as unknown as Sql);

  type Person = { name: string; submitted: string[]; best: Map<number, number>; work: Record<string, unknown>[] };
  const people = new Map<string, Person>();
  for (const s of subs) {
    const p: Person = people.get(s.email as string) ?? { name: s.name as string, submitted: [], best: new Map(), work: [] };
    p.submitted.push(s.unit as string);
    p.work.push(s);
    people.set(s.email as string, p);
  }
  for (const q of quizzes) {
    const p: Person = people.get(q.email as string) ?? { name: q.email as string, submitted: [], best: new Map(), work: [] };
    p.best.set(Number(q.day), Number(q.best));
    people.set(q.email as string, p);
  }
  const titleOf = (id: string) => allUnits().find((u) => u.id === id)?.title ?? id;

  return (
    <div className="mt-6 space-y-4">
      {[...people.entries()].length === 0 && <p className="text-muted">Nobody has started yet.</p>}
      {[...people.entries()].map(([email, p]) => {
        const passed = [...p.best].filter(([, v]) => v >= PE_PASS_PERCENT).map(([k]) => k);
        return (
          <details key={email} className="card p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              {p.name} <span className="font-normal text-muted">({email}) - level {peLevel(p.submitted, passed)}, {p.submitted.length} lab(s) submitted</span>
            </summary>
            <div className="mt-3 space-y-4 text-sm">
              {p.work.map((w) => (
                <div key={w.unit as string} className="rounded-lg border border-line p-3">
                  <p className="font-semibold">
                    {titleOf(w.unit as string)} <span className={`chip-${w.status === "approved" ? "done" : w.status === "changes" ? "late" : "idle"} mr-2`}>{w.status === "approved" ? "Approved" : w.status === "changes" ? "Sent back" : "To review"}</span><span className="font-normal text-muted">| quiz best {p.best.get(peQuizOf(w.unit as string)) ?? "-"}%</span>
                  </p>
                  {Object.entries(LABELS).map(([k, label]) => {
                    const v = (w.fields as Record<string, string>)[k];
                    return v ? (
                      <div key={k} className="mt-2">
                        <p className="text-xs font-semibold text-muted">{label}</p>
                        <p className="whitespace-pre-wrap">{v}</p>
                      </div>
                    ) : null;
                  })}
                  <PeReview email={email} unit={w.unit as string} status={w.status as string} feedback={(w.feedback as string | null) ?? null} />
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering" className="link text-sm">
        Prompt Engineering
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Progress</h1>
      <p className="text-muted">Every participant who has submitted a lab or taken a quiz. Review each lab: approve it, or send it back with feedback (the unit does not count until it is resubmitted). Labs waiting for review are listed first.</p>
      <Suspense fallback={<PageSkeleton />}>
        <Progress />
      </Suspense>
    </main>
  );
}
