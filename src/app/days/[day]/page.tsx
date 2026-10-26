import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DAYS, formatDate, getDay } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";
import { getTrackTask } from "@/track/tasks";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { isLessonOpen } from "@/lib/schedule";
import CheckIn from "@/components/CheckIn";

export function generateStaticParams() {
  return DAYS.map((d) => ({ day: String(d.day) }));
}

async function DayContent({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const entry = getDay(Number(day));
  if (!entry) notFound();

  // Locked until the day's date; the content is never sent to participants before then.
  // Session first: reading it makes the rest dynamic, so locked content is never prerendered.
  const email = (await auth())?.user?.email;
  if (!isLessonOpen() && !(await actingFacilitator(email))) {
    return (
      <p className="mt-6 card border-dashed p-6 text-muted">
        Day {entry.day}: {entry.title} opens on {formatDate(entry.date)}. The lab, prompts and quiz appear that morning.
      </p>
    );
  }

  const Showcase = SHOWCASES[entry.day];
  const prev = getDay(entry.day - 1);
  const next = getDay(entry.day + 1);

  return (
    <>
      <CheckIn day={entry.day} />
      <p className="mt-4 text-sm text-muted">
        {entry.level} | {formatDate(entry.date)}
      </p>
      <h1 className="mb-8 mt-1 text-3xl font-extrabold tracking-tight">
        Day {entry.day}: {entry.title}
      </h1>

      {Showcase ? (
        <Showcase />
      ) : (
        <p className="card border-dashed p-6 text-muted">
          This day&apos;s showcase is added the day before the session. Create <code>src/days/day-{String(entry.day).padStart(2, "0")}/</code>{" "}
          and register it in <code>src/days/showcases.tsx</code>.
        </p>
      )}

      {getTrackTask(entry.day) && (
        <p className="mt-10 card border-dashed px-4 py-3 text-sm">
          Optional app track, Day {entry.day}: {getTrackTask(entry.day)!.title}.{" "}
          <Link href={`/track#day-${entry.day}`} className="link">
            See the task
          </Link>
        </p>
      )}

      <nav className="mt-12 flex justify-between text-sm">
        {prev ? <Link href={`/days/${prev.day}`}>Previous: Day {prev.day}</Link> : <span />}
        {next ? <Link href={`/days/${next.day}`}>Next: Day {next.day}</Link> : <span />}
      </nav>
    </>
  );
}

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/library" className="link text-sm">
        Library
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <DayContent params={params} />
      </Suspense>
    </main>
  );
}
