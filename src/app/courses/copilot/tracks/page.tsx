import { Suspense } from "react";
import Link from "next/link";
import { GT_SESSIONS, gtQuizOf, gtTrackDone, gtUnitId } from "@/lib/gt";
import { GtLocked, gtViewer } from "@/components/GtParts";
import EnrollButton from "@/components/EnrollButton";
import { TRACKS } from "@/program/tracks";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Team tracks | GitHub Copilot" };

async function Tracks() {
  const { state, allowed, facilitator } = await gtViewer();
  if (!allowed) return <GtLocked />;
  const submitted = new Set(state?.submitted ?? []);
  const passed = new Set(state?.passed ?? []);
  const mine = state?.track ?? null;
  // A participant sees only their own track once they have one; facilitators always see all of them.
  const shown = facilitator || !mine ? TRACKS : TRACKS.filter((t) => t.id === mine);
  return (
    <>
      {!mine && !facilitator && <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">Choose the track for your team. You can do this once; after that only a facilitator can change it.</p>}
      {mine && (
        <p className="mt-4 text-sm">
          Your track: <b>{TRACKS.find((t) => t.id === mine)?.name}</b>. {state?.stage3 ? "Stage 3 (weekly apps) is open." : "Finish its five labs and the quiz to open Stage 3 (weekly apps)."}
        </p>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((t) => {
          const done = gtTrackDone(t.id, submitted, passed);
          const labs = Array.from({ length: GT_SESSIONS }, (_, i) => gtUnitId(t.id, i + 1)).filter((u) => submitted.has(u)).length;
          return (
            <div key={t.id} className={`card flex flex-col p-5 ${mine === t.id ? "!border-brand ring-2 ring-brand/20" : ""}`}>
              <span className={done ? "chip-done w-fit" : "chip-idle w-fit"}>{done ? "Track complete" : mine === t.id ? `${labs} of ${GT_SESSIONS} labs${passed.has(gtQuizOf(t.id)) ? ", quiz passed" : ""}` : "Not started"}</span>
              <h2 className="mt-3 text-lg font-bold">{t.name}</h2>
              <p className="mt-1 text-sm text-muted">{t.audience}</p>
              <p className="mt-2 flex-1 text-sm">{t.dailyWork}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {(mine === t.id || facilitator) && <Link href={`/courses/copilot/tracks/${t.id}`} className="btn-primary">Open track</Link>}
                {!mine && !facilitator && <EnrollButton track={t.id} label="Start this track" confirmText={`Start the ${t.name} track? You cannot change it yourself afterwards.`} />}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function TracksPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot" className="link text-sm">
        GitHub Copilot
      </Link>
      <h1 className="mb-2 mt-3 text-3xl font-extrabold tracking-tight">Stage 2: Team tracks</h1>
      <p className="text-muted">Pick the track that matches your daily work. Each track has five sessions with a lab (commit screenshot plus a short write-up, reviewed by a facilitator) and a quiz. Finishing your track opens Stage 3, the weekly apps.</p>
      <Suspense fallback={<PageSkeleton />}>
        <Tracks />
      </Suspense>
    </main>
  );
}
