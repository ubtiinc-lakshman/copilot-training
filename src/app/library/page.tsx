import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { DAYS, LEVELS, formatDate } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";
import { isOpen } from "@/lib/schedule";

export const metadata = { title: "Self-learning library" };

async function DayList() {
  await connection(); // the badges depend on today's date
  return (
    <>
      {LEVELS.map((level) => (
        <section key={level} className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Level: {level}</h2>
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {DAYS.filter((d) => d.level === level).map((d) => (
              <li key={d.day}>
                <Link href={`/days/${d.day}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <span>
                    <b>Day {d.day}</b> {d.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-zinc-500">
                    {!isOpen(d.date) ? (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Opens {formatDate(d.date)}</span>
                    ) : (
                      <>
                        {formatDate(d.date)}
                        {SHOWCASES[d.day] ? (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">Ready</span>
                        ) : (
                          <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600">Planned</span>
                        )}
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export default function Library() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Home
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Self-learning library</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        The 30 Copilot lessons, with labs and quizzes. Use them to go deeper on anything the weekly sessions touch. Each weekly session on{" "}
        <Link href="/" className="underline">
          Home
        </Link>{" "}
        links to the lessons that match it.
      </p>

      <p className="mt-4 rounded border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800">
        Older optional extra: build one Next.js app alongside the first 10 lessons.{" "}
        <Link href="/track" className="font-semibold text-blue-600 hover:underline">
          Open the app track
        </Link>
      </p>

      <Suspense fallback={<p className="mt-10 text-zinc-500">Loading...</p>}>
        <DayList />
      </Suspense>
    </main>
  );
}
