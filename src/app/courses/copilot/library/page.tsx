import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { DAYS, LEVELS, formatDate } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";
import { isLessonOpen } from "@/lib/schedule";

export const metadata = { title: "Self-learning library" };

async function DayList() {
  await connection(); // the badges depend on today's date
  return (
    <>
      {LEVELS.map((level) => (
        <section key={level} className="mt-10">
          <h2 className="mb-3 text-xl font-bold">{level}</h2>
          <ul className="card divide-y divide-line overflow-hidden">
            {DAYS.filter((d) => d.level === level).map((d) => (
              <li key={d.day}>
                <Link href={`/courses/copilot/days/${d.day}`} className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-brand-soft">
                  <span>
                    <b className="mr-2 text-brand">Day {d.day}</b> {d.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-muted">
                    {!isLessonOpen() ? (
                      <span className="chip-idle">{formatDate(d.date)}</span>
                    ) : (
                      <>
                        {formatDate(d.date)}
                        {SHOWCASES[d.day] ? (
                          <span className="chip-done">Ready</span>
                        ) : (
                          <span className="chip-idle">Planned</span>
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
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot" className="link text-sm">
        GitHub Copilot
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Self-learning library</h1>
      <p className="mt-2 text-muted">
        The 30 Copilot lessons, with labs and quizzes. Use them to go deeper on anything the weekly sessions touch. Each weekly session on{" "}
        <Link href="/courses/copilot" className="link">
          Home
        </Link>{" "}
        links to the lessons that match it.
      </p>

      <p className="card mt-5 px-5 py-3 text-sm">
        Older optional extra: build one Next.js app alongside the first 10 lessons.{" "}
        <Link href="/courses/copilot/track" className="link">
          Open the app track
        </Link>
      </p>

      <Suspense fallback={<p className="mt-10 text-muted">Loading...</p>}>
        <DayList />
      </Suspense>
    </main>
  );
}
