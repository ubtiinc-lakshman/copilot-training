import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PeUnit from "@/components/PeUnit";
import { TRACKS, getTrack, trackUnit } from "@/program/pe";

export const generateStaticParams = () => TRACKS.map((t) => ({ track: t.id }));

async function Track({ params }: { params: Promise<{ track: string }> }) {
  const track = getTrack((await params).track);
  if (!track) notFound();
  return <PeUnit unit={trackUnit(track)} />;
}

export default function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering/l2" className="link text-sm">
        Level 2 tracks
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Track params={params} />
      </Suspense>
    </main>
  );
}
