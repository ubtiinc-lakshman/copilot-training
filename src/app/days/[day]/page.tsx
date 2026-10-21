import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DAYS, formatDate, getDay } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";

export function generateStaticParams() {
  return DAYS.map((d) => ({ day: String(d.day) }));
}

async function DayContent({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const entry = getDay(Number(day));
  if (!entry) notFound();

  const Showcase = SHOWCASES[entry.day];
  const prev = getDay(entry.day - 1);
  const next = getDay(entry.day + 1);

  return (
    <>
      <p className="mt-4 text-sm text-zinc-500">
        {entry.level} | {formatDate(entry.date)}
      </p>
      <h1 className="mb-8 mt-1 text-3xl font-bold">
        Day {entry.day}: {entry.title}
      </h1>

      {Showcase ? (
        <Showcase />
      ) : (
        <p className="rounded border border-dashed border-zinc-300 p-6 text-zinc-600">
          This day&apos;s showcase is added the day before the session. Create <code>src/days/day-{String(entry.day).padStart(2, "0")}/</code>{" "}
          and register it in <code>src/days/showcases.tsx</code>.
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
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        All days
      </Link>
      <Suspense fallback={<p className="mt-6 text-zinc-500">Loading...</p>}>
        <DayContent params={params} />
      </Suspense>
    </main>
  );
}
