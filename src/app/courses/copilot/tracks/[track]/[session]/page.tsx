import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GT_SESSIONS, gtUnitId } from "@/lib/gt";
import { GtLocked, GtNotYours, gtViewer } from "@/components/GtParts";
import { Section } from "@/components/Section";
import GtLabForm from "@/components/GtLabForm";
import { TRACKS } from "@/program/tracks";

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`ml-5 space-y-1 text-sm ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((i) => <li key={i}>{i}</li>)}
    </Tag>
  );
};

async function Session({ params }: { params: Promise<{ track: string; session: string }> }) {
  const { track: trackId, session } = await params;
  const track = TRACKS.find((t) => t.id === trackId);
  const n = Number(session);
  const s = track?.sessions[n - 1];
  if (!track || !s || !Number.isInteger(n) || n < 1 || n > GT_SESSIONS) notFound();
  const { state, allowed, facilitator } = await gtViewer();
  if (!allowed) return <GtLocked />;
  if (!facilitator && state?.track !== track.id) return <GtNotYours mine={state?.track ?? null} />;

  const unit = gtUnitId(track.id, n);
  const mine = state?.subs.find((x) => x.unit === unit);
  return (
    <>
      <p className="mt-4 text-sm text-muted">{track.name} | Session {n} of {GT_SESSIONS}</p>
      <h1 className="mb-2 mt-1 text-3xl font-extrabold tracking-tight">{s.title}</h1>
      <p className="mb-8 text-muted">{s.objective}</p>
      <div className="space-y-6">
        <Section title="What this session covers">
          {s.modules.map((mi) => (
            <div key={mi}>
              <p className="text-sm font-semibold">{track.modules[mi].title}</p>
              <List items={track.modules[mi].topics} />
            </div>
          ))}
        </Section>
        <Section title="Lab">
          <p className="text-sm">{s.lab}</p>
          <p className="pt-2 text-sm font-semibold">You are done when:</p>
          <List items={s.doneWhen} />
          {mine && (
            <p className={`rounded-xl border p-3 text-sm ${mine.status === "approved" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : mine.status === "changes" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-line text-muted"}`}>
              <span className="font-semibold">{mine.status === "approved" ? "Approved by a facilitator." : mine.status === "changes" ? "Sent back for changes. Update your lab and resubmit." : "Submitted. Waiting for a facilitator to review."}</span>
              {mine.feedback ? <span className="mt-1 block whitespace-pre-wrap">{String(mine.feedback)}</span> : null}
            </p>
          )}
          <GtLabForm unit={unit} initial={(mine?.fields as Record<string, string> | undefined) ?? null} hasProof={!!state?.proofs.has(unit)} />
        </Section>
        <nav className="flex justify-between text-sm">
          {n > 1 ? <Link className="link" href={`/courses/copilot/tracks/${track.id}/${n - 1}`}>Previous session</Link> : <span />}
          {n < GT_SESSIONS ? <Link className="link" href={`/courses/copilot/tracks/${track.id}/${n + 1}`}>Next session</Link> : <Link className="link" href={`/courses/copilot/tracks/${track.id}`}>Back to the track and quiz</Link>}
        </nav>
      </div>
    </>
  );
}

export default function SessionPage({ params }: { params: Promise<{ track: string; session: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <BackLink params={params} />
        <Session params={params} />
      </Suspense>
    </main>
  );
}

async function BackLink({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  return (
    <Link href={`/courses/copilot/tracks/${track}`} className="link text-sm">
      Back to the track
    </Link>
  );
}
