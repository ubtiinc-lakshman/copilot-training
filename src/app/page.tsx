import Link from "next/link";
import { DAYS, LEVELS, formatDate } from "@/days/registry";
import { SHOWCASES } from "@/days/showcases";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">GitHub Copilot Training</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Developers &amp; QA track. 30 sessions, Oct 21 to Dec 1, 2026. One folder per day in <code>src/days</code>.
      </p>

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
                    {formatDate(d.date)}
                    {SHOWCASES[d.day] ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">Ready</span>
                    ) : (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600">Planned</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
