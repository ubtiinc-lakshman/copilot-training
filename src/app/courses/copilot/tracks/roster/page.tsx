import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { GT_SESSIONS, GT_TRACKS, gtQuizOf, gtStage3Open, gtTrackDone, gtUnitId } from "@/lib/gt";
import { PE_PASS_PERCENT } from "@/lib/pe";
import { loadGtRoster } from "@/lib/gtDb";
import type { Sql } from "@/lib/assign";
import EnrollSelect from "@/components/EnrollSelect";
import { TRACKS } from "@/program/tracks";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Track roster | GitHub Copilot" };

const trackName = (id: string | null) => TRACKS.find((t) => t.id === id)?.name ?? "-";

// Facilitators only: who is on which track, how far they are, and the stage they have reached.
async function Roster() {
  await connection(); // depends on the signed-in user
  if (!(await actingFacilitator((await currentUser())?.email))) redirect("/courses/copilot");
  const { people, enrol, subs, quizzes, gate, started } = await loadGtRoster((await db()) as unknown as Sql);

  const track = new Map(enrol.map((e) => [e.email as string, e.track as string]));
  const rows = people.map((p) => {
    const email = p.email as string;
    const mine = track.get(email) ?? null;
    const units = new Set(subs.filter((s) => s.email === email && s.status !== "changes").map((s) => s.unit as string));
    const approved = subs.filter((s) => s.email === email && s.status === "approved").length;
    const pending = subs.filter((s) => s.email === email && s.status === "pending").length;
    const passed = new Set(quizzes.filter((q) => q.email === email && Number(q.best) >= PE_PASS_PERCENT).map((q) => Number(q.day)));
    const best = mine ? quizzes.find((q) => q.email === email && Number(q.day) === gtQuizOf(mine)) : undefined;
    const labs = mine ? Array.from({ length: GT_SESSIONS }, (_, i) => gtUnitId(mine, i + 1)).filter((u) => units.has(u)).length : 0;
    const stage3 = gtStage3Open(mine, units, passed, started.has(email));
    const stage = stage3 ? 3 : gate.has(email) ? 2 : 1;
    return { email, name: p.name as string, team: (p.team as string | null) ?? "-", mine, labs, approved, pending, best: best ? Number(best.best) : null, done: mine ? gtTrackDone(mine, units, passed) : false, stage, grandfathered: !gtTrackDone(mine ?? "", units, passed) && started.has(email) };
  });

  const count = (t: string) => rows.filter((r) => r.mine === t).length;
  const waiting = rows.filter((r) => !r.mine && r.stage === 2);
  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        {GT_TRACKS.map((t) => (
          <span key={t} className="chip-idle">{trackName(t)}: {count(t)}</span>
        ))}
        <span className="chip-today">Stage 2, no track yet: {waiting.length}</span>
        <span className="chip-idle">Stage 3 open: {rows.filter((r) => r.stage === 3).length}</span>
      </div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Roster team</th>
              <th className="p-3">Stage</th>
              <th className="p-3">Track</th>
              <th className="p-3">Labs</th>
              <th className="p-3">Quiz</th>
              <th className="p-3">Assign</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email} className="border-b border-line last:border-0">
                <td className="p-3">{r.name}<span className="block text-xs text-muted">{r.email}</span></td>
                <td className="p-3">{r.team}</td>
                <td className="p-3">
                  <span className={r.stage === 3 ? "chip-done" : r.stage === 2 ? "chip-today" : "chip-idle"}>Stage {r.stage}</span>
                  {r.grandfathered && <span className="block text-xs text-muted">weekly apps started earlier</span>}
                </td>
                <td className="p-3">{trackName(r.mine)} {r.done && <span className="chip-done ml-1">Complete</span>}</td>
                <td className="p-3">{r.mine ? `${r.labs} of ${GT_SESSIONS} submitted, ${r.approved} approved${r.pending ? `, ${r.pending} to review` : ""}` : "-"}</td>
                <td className="p-3">{r.best === null ? "-" : `${r.best}%`}</td>
                <td className="p-3"><EnrollSelect email={r.email} current={r.mine} tracks={TRACKS.map((t) => ({ id: t.id, name: t.name }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function TrackRosterPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot/tracks" className="link text-sm">
        Team tracks
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Track roster</h1>
      <p className="text-muted">Everyone on the participant list: the stage they are in, their track and progress. People pick their own track once; use Assign to set or change it (for example to match the roster team).</p>
      <Suspense fallback={<PageSkeleton />}>
        <Roster />
      </Suspense>
    </main>
  );
}
