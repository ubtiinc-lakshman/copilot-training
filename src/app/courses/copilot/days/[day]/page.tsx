import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { DAYS, formatDate, getDay } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";
import { getTrackTask } from "@/track/tasks";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { isLessonOpen } from "@/lib/schedule";
import CheckIn from "@/components/CheckIn";
import { PageSkeleton } from "@/components/Skeleton";

export function generateStaticParams() {
  return DAYS.map((d) => ({ day: String(d.day) }));
}

async function DayContent({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const entry = getDay(Number(day));
  if (!entry) notFound();

  // Locked until the day's date; the content is never sent to participants before then.
  // Session first: reading it makes the rest dynamic, so locked content is never prerendered.
  await connection(); // auth() uses random bytes, so render per request, not at build
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
      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <span className="chip-brand">{entry.level}</span>
        {formatDate(entry.date)}
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
          <Link href={`/courses/copilot/track#day-${entry.day}`} className="link">
            See the task
          </Link>
        </p>
      )}

      <nav className="mt-12 grid gap-3 text-sm sm:grid-cols-2">
        {prev ? (
          <Link href={`/courses/copilot/days/${prev.day}`} className="card-link p-4">
            <span className="text-xs text-muted">Previous</span>
            <span className="block font-semibold">Day {prev.day}: {prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/courses/copilot/days/${next.day}`} className="card-link p-4 text-right sm:col-start-2">
            <span className="text-xs text-muted">Next</span>
            <span className="block font-semibold">Day {next.day}: {next.title}</span>
          </Link>
        )}
      </nav>
    </>
  );
}

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot/library" className="link text-sm">
        Library
      </Link>
      <Suspense fallback={<PageSkeleton />}>
        <DayContent params={params} />
      </Suspense>
    </main>
  );
}
