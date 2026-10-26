import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { loadMine } from "@/lib/program";
import type { Sql } from "@/lib/assign";
import { currentUser } from "@/lib/user";
import { todayISO } from "@/lib/schedule";
import { DAYS, formatDate } from "@/days/registry";
import { EVENTS, WEEKS, currentWeek, eventsOn, libraryFor, nextEvent } from "@/program/calendar";

async function Dashboard() {
  await connection(); // depends on today's date and the signed-in user
  const user = await currentUser();
  const today = todayISO();
  const mine = user ? await loadMine((await db()) as unknown as Sql, user.email) : null;
  const done = new Set((mine?.completions ?? []).map((c) => c.activity as string));
  const submitted = new Set((mine?.submissions ?? []).map((s) => s.week as number));
  const titles = new Map((mine?.assignments ?? []).map((a) => [a.week as number, (a.data as { title: string }).title]));

  const week = currentWeek(today);
  const todays = eventsOn(today);
  const next = nextEvent(today);

  const state = (id: string, date: string) =>
    done.has(id) ? (
      <span className="text-green-700">Done</span>
    ) : date === today ? (
      <span className="font-semibold text-amber-700">Today</span>
    ) : date < today ? (
      <span className="text-red-600">Not done</span>
    ) : (
      <span className="text-zinc-400">{formatDate(date)}</span>
    );

  return (
    <>
      <Link href="/today" className="mt-6 block rounded-lg border border-blue-300 bg-blue-50 p-5 text-blue-950 hover:bg-blue-100">
        <p className="text-sm">{formatDate(today)}</p>
        {todays.length > 0 ? (
          <>
            <p className="text-lg font-bold">Today: {todays.map((e) => e.title).join(" + ")}</p>
            <p className="text-sm underline">Open My week for the lab and to mark it done</p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">Nothing scheduled today</p>
            {next && <p className="text-sm">Next: {next.title} on {formatDate(next.date)}</p>}
          </>
        )}
      </Link>

      <h2 className="mb-3 mt-10 text-xl font-semibold">The five apps</h2>
      <div className="space-y-4">
        {WEEKS.map((w) => {
          const evs = EVENTS.filter((e) => e.week === w.week && e.kind !== "submit" && e.kind !== "finale");
          const started = today >= w.assignOpens;
          return (
            <section key={w.week} className={`rounded-lg border p-4 ${w.week === week ? "border-blue-400" : "border-zinc-200 dark:border-zinc-800"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold">
                  App {w.week}: {w.feature}
                </h3>
                <span className="text-sm text-zinc-500">
                  {formatDate(w.assignOpens)} to {formatDate(w.due)}
                </span>
              </div>
              <p className="mt-1 text-sm">
                {titles.has(w.week) ? (
                  <>Your pain point: <b>{titles.get(w.week)}</b></>
                ) : started ? (
                  <Link href="/today" className="text-blue-600 underline">Get your pain point</Link>
                ) : (
                  <span className="text-zinc-500">Pain point assigned on {formatDate(w.assignOpens)}</span>
                )}
                {" · "}
                {submitted.has(w.week) ? <span className="text-green-700">Submitted</span> : <span className="text-zinc-500">Not submitted</span>}
              </p>
              <ul className="mt-2 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
                {evs.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-2 py-1">
                    <span>
                      {e.title}
                      {libraryFor(e.id).length > 0 && (
                        <span className="ml-2 text-zinc-500">
                          Go deeper:{" "}
                          {libraryFor(e.id).map((n, i) => (
                            <span key={n}>
                              {i > 0 && ", "}
                              <Link href={`/days/${n}`} className="text-blue-600 underline" title={DAYS.find((d) => d.day === n)?.title}>
                                Day {n}
                              </Link>
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    {state(e.id, e.date)}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">GitHub Copilot Training</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Build a real app every week, Oct 27 to Dec 1, 2026. Each session teaches one skill and you use it on your own app.
      </p>

      <Suspense fallback={<p className="mt-10 text-zinc-500">Loading...</p>}>
        <Dashboard />
      </Suspense>

      <Link href="/library" className="mt-10 block rounded-lg border border-zinc-200 p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
        <p className="text-lg font-bold">Self-learning library</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The 30 Copilot lessons with labs and quizzes, plus the optional Order Desk app track. Use them whenever you want to go deeper.
        </p>
      </Link>
    </main>
  );
}
