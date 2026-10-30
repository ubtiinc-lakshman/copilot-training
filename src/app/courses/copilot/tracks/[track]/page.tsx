import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GT_TRACKS, gtQuizOf, gtTrackDone, gtUnitId } from "@/lib/gt";
import { PE_PASS_PERCENT } from "@/lib/pe";
import { GtLocked, GtNotYours, gtViewer } from "@/components/GtParts";
import { Section } from "@/components/Section";
import Quiz from "@/components/Quiz";
import { TRACKS } from "@/program/tracks";
import { PageSkeleton } from "@/components/Skeleton";

export const generateStaticParams = () => GT_TRACKS.map((track) => ({ track }));

// The playbook that already exists for the track (the other tracks have no playbook yet).
const PLAYBOOK: Record<string, { slug: string; label: string }> = {
  dev: { slug: "gc-developer-playbook", label: "Developer playbook" },
  qa: { slug: "gc-qa-playbook", label: "QA playbook" },
};

async function Track({ params }: { params: Promise<{ track: string }> }) {
  const trackId = (await params).track;
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) notFound();
  const { state, allowed, facilitator } = await gtViewer();
  if (!allowed) return <GtLocked />;
  if (!facilitator && state?.track !== track.id) return <GtNotYours mine={state?.track ?? null} />;

  const submitted = new Set(state?.submitted ?? []);
  const passed = new Set(state?.passed ?? []);
  const status = new Map((state?.subs ?? []).map((s) => [s.unit as string, s.status as string]));
  const quiz = gtQuizOf(track.id);
  const best = state?.best[quiz];
  const book = PLAYBOOK[track.id];

  return (
    <>
      <p className="mt-4 text-sm text-muted">Stage 2 | Team track</p>
      <h1 className="mb-2 mt-1 text-3xl font-extrabold tracking-tight">{track.name}</h1>
      <p className="mb-2 text-muted">{track.audience}</p>
      {gtTrackDone(track.id, submitted, passed) && <p className="chip-done mb-4">Track complete</p>}
      <div className="space-y-6">
        <Section title="Your daily work">
          <p className="text-sm">{track.dailyWork}</p>
          {book && (
            <p className="text-sm">
              Reference: <Link href={`/courses/copilot/docs/${book.slug}`} className="link">{book.label}</Link>. More in the <Link href="/courses/copilot/docs" className="link">Documents</Link>.
            </p>
          )}
        </Section>

        <Section title="Modules">
          <div className="grid gap-4 md:grid-cols-2">
            {track.modules.map((m) => (
              <div key={m.title}>
                <p className="text-sm font-semibold">{m.title}</p>
                <ul className="ml-5 list-disc text-sm">
                  {m.topics.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Sessions and labs">
          <ol className="space-y-2 text-sm">
            {track.sessions.map((s, i) => {
              const unit = gtUnitId(track.id, i + 1);
              const st = status.get(unit);
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/courses/copilot/tracks/${track.id}/${i + 1}`} className="link">
                    Session {i + 1}: {s.title}
                  </Link>
                  <span className={st === "approved" ? "chip-done" : st === "changes" ? "chip-late" : st ? "chip-today" : "chip-idle"}>
                    {st === "approved" ? "Approved" : st === "changes" ? "Sent back" : st ? "Waiting for review" : "Not started"}
                  </span>
                </li>
              );
            })}
          </ol>
        </Section>

        <Section title="Capstone and project">
          <p className="text-sm"><span className="font-semibold">Capstone path:</span> {track.capstone}</p>
          <p className="text-sm"><span className="font-semibold">Track project:</span> {track.project}</p>
          <p className="text-sm text-muted">Sessions 4 and 5 are the capstone build; agree the task with your team lead first.</p>
        </Section>

        <Section title={`Track quiz (pass mark ${PE_PASS_PERCENT}%)`}>
          <p className="text-sm text-muted">
            {passed.has(quiz) ? `Passed (best ${best}%).` : best !== undefined ? `Best so far ${best}%.` : "Not attempted yet."} The track is complete when all five labs are submitted (and not sent back) and the quiz is passed.
          </p>
          <Quiz day={quiz} passPercent={PE_PASS_PERCENT} />
        </Section>
      </div>
    </>
  );
}

export default function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot/tracks" className="link text-sm">
        Team tracks
      </Link>
      <Suspense fallback={<PageSkeleton />}>
        <Track params={params} />
      </Suspense>
    </main>
  );
}
