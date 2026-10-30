import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { levelOf, loadMine } from "@/lib/program";
import type { Sql } from "@/lib/assign";
import { currentUser } from "@/lib/user";
import { DAYS } from "@/days/registry";
import type { PainPoint } from "@/lib/assign";
import { SESSIONS } from "@/program/sessions";
import { EVENTS, WEEKS, getWeek, libraryFor, type ProgramEvent } from "@/program/calendar";
import { LabDone, PainPointCard, PainPointView, SubmissionForm, type SubmissionData } from "@/components/ProgramActions";

import { actingFacilitator } from "@/lib/viewMode";
import { isStage3Open } from "@/lib/gtDb";

export const metadata = { title: "Weekly apps" };

type Submission = SubmissionData & { week: number; submitted_at: string };

function Stage3Locked() {
  return (
    <div className="card p-6 text-sm">
      <h1 className="text-2xl font-extrabold tracking-tight">Stage 3: Weekly apps</h1>
      <p className="mt-3 font-semibold">This opens when you finish your team track</p>
      <p className="mt-1 text-muted">Complete the five labs of your track (approved by a facilitator is not required, but a lab sent back does not count) and pass the track quiz at 70%.</p>
      <Link href="/courses/copilot/tracks" className="link mt-3 inline-block">Go to Team tracks</Link>
    </div>
  );
}

async function MyWeek() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  if (!user) redirect("/login");

  if (!(await actingFacilitator(user.email)) && !(await isStage3Open((await db()) as unknown as Sql, user.email))) return <Stage3Locked />;

  const { completions: comps, submissions: subs, assignments: assigns, proofs } = await loadMine((await db()) as unknown as Sql, user.email);
  const done = new Map(comps.map((c) => [c.activity as string, (c.note as string | null) ?? ""]));
  const submissions = new Map((subs as unknown as Submission[]).map((s) => [s.week, s]));
  const painPoints = new Map(assigns.map((a) => [a.week as number, { id: a.id, ...(a.data as object) } as PainPoint]));

  const proofSet = new Set(proofs.map((p) => p.activity as string));
  // Levels: you are on week N until you submit its app; then week N+1 opens.
  const week = levelOf(submissions.keys());
  const info = getWeek(week)!;
  const levelEvents = EVENTS.filter((e) => e.week === week && e.kind !== "finale");

  const eventCard = (e: ProgramEvent) => (
    <section key={e.id} className="card space-y-2 p-6">
      <h3 className="text-lg font-bold">{e.title}</h3>
      {e.skill && (
        <p className="text-sm">
          <b>What we cover:</b> {e.skill}
        </p>
      )}
      {e.lab && (
        <p className="text-sm">
          <b>Your lab:</b> {e.lab}
        </p>
      )}
      {SESSIONS[e.id] && (
        <Link href={`/courses/copilot/sessions/${e.id}`} className="btn-primary">
          Open session content
        </Link>
      )}
      {libraryFor(e.id).length > 0 && (
        <p className="text-sm text-muted">
          Go deeper:{" "}
          {libraryFor(e.id).map((n, i) => (
            <span key={n}>
              {i > 0 && ", "}
              <Link href={`/courses/copilot/days/${n}`} className="link">
                Day {n}: {DAYS.find((d) => d.day === n)?.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      {e.kind === "submit" ? (
        <>
          <p className="text-sm text-muted">
            Submit your deployed app for week {e.week}, then tell us the challenge you faced and how you solved it. This opens the next level.
          </p>
          <SubmissionForm week={e.week} initial={submissions.get(e.week) ?? null} />
        </>
      ) : (
        <LabDone
          key={e.id + done.has(e.id)}
          id={e.id}
          label={e.kind === "session" ? "I completed this lab" : e.kind === "call" ? "I finished and deployed my app" : "I took part"}
          initialDone={done.has(e.id)}
          initialNote={done.get(e.id) ?? ""}
          proof={e.kind === "session"}
          hasProof={proofSet.has(e.id)}
        />
      )}
    </section>
  );

  const status = (e: ProgramEvent) => {
    if (e.kind === "submit") {
      const s = submissions.get(e.week);
      if (s) return <span className="text-emerald-700">Submitted: <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.url}</a></span>;
      return e.week <= week ? <span className="text-muted">Not submitted</span> : <span className="text-muted">Locked</span>;
    }
    if (done.has(e.id)) return <span className="font-semibold text-emerald-700">Completed</span>;
    return e.week === week ? <span className="chip-today">Your level</span> : e.week < week ? <span className="text-muted">Not done</span> : <span className="text-muted">Locked</span>;
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Stage 3: Weekly apps</h1>
        <p className="mt-1 text-muted">
          Level {week} of {WEEKS.length}. Your app: <b>{info.feature}</b>. Work at your own pace: submit this app to unlock the next level.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Level {week}: your steps</h2>
        {levelEvents.map(eventCard)}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Level {week} pain point</h2>
        <PainPointCard key={`${week}${painPoints.has(week)}`} initial={painPoints.get(week) ?? null} open opensOn="" />
      </section>

      {[...painPoints.entries()].filter(([w]) => w !== week).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Earlier pain points</h2>
          {[...painPoints.entries()]
            .filter(([w]) => w !== week)
            .sort(([a], [b]) => a - b)
            .map(([w, p]) => (
              <div key={w}>
                <p className="mb-1 text-sm font-semibold">Week {w}</p>
                <PainPointView p={p} />
              </div>
            ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">My progress</h2>
        <table className="card w-full overflow-hidden text-sm">
          <tbody>
            {EVENTS.map((e) => (
              <tr key={e.id} className="border-b border-line align-top">
                <td className="w-28 py-1 pr-3 text-muted">Level {e.week}</td>
                <td className="pr-3">{SESSIONS[e.id] ? <Link href={`/courses/copilot/sessions/${e.id}`} className="link">{e.title}</Link> : e.title}</td>
                <td>{status(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-sm text-muted">
        Earlier Copilot lessons (the 30-day library) are still available for self-learning:{" "}
        <Link href="/courses/copilot/library" className="link">
          open the library
        </Link>
        .
      </p>
    </div>
  );
}

export default function TodayPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <MyWeek />
      </Suspense>
    </main>
  );
}
