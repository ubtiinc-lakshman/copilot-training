import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { loadMine } from "@/lib/program";
import type { Sql } from "@/lib/assign";
import { currentUser } from "@/lib/user";
import { todayISO } from "@/lib/schedule";
import { DAYS, formatDate } from "@/days/registry";
import { SESSIONS } from "@/program/sessions";
import { EVENTS, WEEKS, currentWeek, eventsOn, libraryFor, nextEvent, trackedEvents } from "@/program/calendar";

const KIND = { session: "Session", call: "Live call", finale: "Finale", submit: "Submit" } as const;

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
  const doneCount = trackedEvents.filter((e) => done.has(e.id)).length;
  const pct = Math.round((doneCount / trackedEvents.length) * 100);

  const state = (id: string, date: string) =>
    done.has(id) ? (
      <span className="chip-done">Done</span>
    ) : date === today ? (
      <span className="chip-today">Today</span>
    ) : date < today ? (
      <span className="chip-late">Not done</span>
    ) : (
      <span className="chip-idle">{formatDate(date)}</span>
    );

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
        <Link href="/today" className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition hover:shadow-xl" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          <p className="text-sm/6 opacity-80">{formatDate(today)}</p>
          {todays.length > 0 ? (
            <>
              <p className="mt-1 text-2xl font-bold">{todays.map((e) => e.title).join(" + ")}</p>
              <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">Open today&apos;s lab &rarr;</p>
            </>
          ) : (
            <>
              <p className="mt-1 text-2xl font-bold">Nothing scheduled today</p>
              {next && <p className="mt-2 text-sm opacity-90">Next up: {next.title} on {formatDate(next.date)}</p>}
            </>
          )}
        </Link>

        <div className="card flex items-center gap-4 p-6">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(var(--brand) ${pct * 3.6}deg, var(--line) 0)` }}
            role="img"
            aria-label={`${pct} percent of labs completed`}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-surface text-lg font-bold">{pct}%</div>
          </div>
          <div className="text-sm">
            <p className="font-bold">Your progress</p>
            <p className="text-muted">
              {doneCount} of {trackedEvents.length} labs and calls done
            </p>
            <p className="text-muted">{submitted.size} of {WEEKS.length} apps submitted</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-xl font-bold">The five apps</h2>
      <div className="space-y-4">
        {WEEKS.map((w) => {
          const evs = EVENTS.filter((e) => e.week === w.week && e.kind !== "submit" && e.kind !== "finale");
          const started = today >= w.assignOpens;
          const current = w.week === week;
          return (
            <section key={w.week} className={`card p-5 ${current ? "!border-brand ring-2 ring-brand/20" : ""} ${!started ? "opacity-80" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold text-white" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
                    {w.week}
                  </span>
                  <div>
                    <h3 className="font-bold leading-tight">{w.feature}</h3>
                    <p className="text-xs text-muted">
                      {formatDate(w.assignOpens)} &rarr; due {formatDate(w.due)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {current && <span className="chip-brand">This week</span>}
                  {submitted.has(w.week) ? <span className="chip-done">Submitted</span> : <span className="chip-idle">Not submitted</span>}
                </div>
              </div>

              <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm">
                {titles.has(w.week) ? (
                  <>
                    <span className="text-muted">Your pain point:</span> <b>{titles.get(w.week)}</b>
                  </>
                ) : started ? (
                  <Link href="/today" className="link">
                    Get your pain point &rarr;
                  </Link>
                ) : (
                  <span className="text-muted">Pain point is assigned on {formatDate(w.assignOpens)}</span>
                )}
              </p>

              <ul className="mt-3 divide-y divide-line text-sm">
                {evs.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted">{KIND[e.kind]}</span>
                      {SESSIONS[e.id] ? (
                        <Link href={`/sessions/${e.id}`} className="link">
                          {e.title}
                        </Link>
                      ) : (
                        e.title
                      )}
                      {libraryFor(e.id).length > 0 && (
                        <span className="ml-2 text-xs text-muted">
                          Go deeper:{" "}
                          {libraryFor(e.id).map((n, i) => (
                            <span key={n}>
                              {i > 0 && ", "}
                              <Link href={`/days/${n}`} className="link" title={DAYS.find((d) => d.day === n)?.title}>
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
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="chip-brand">GitHub Copilot Training</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
        Learn Copilot{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          together
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">Eight common days for everyone. The weekly app builds and the library are there to practise on your own time.</p>

      <Link href="/common" className="card-link mt-8 flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-lg font-bold">Common GitHub Copilot days (main program)</p>
          <p className="text-sm text-muted">Eight shared days for all teams, full days, Mon-Fri from Nov 2: terms, prompts, security, agents, and a practical gate.</p>
        </div>
        <span className="text-2xl text-brand">&rarr;</span>
      </Link>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Self-paced: build an app every week</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">Optional practice. Each lab teaches one skill that you use on your own app, deploy, and submit. Dates are a suggested pace; there are no live sessions.</p>

      <Suspense fallback={<p className="mt-10 text-muted">Loading...</p>}>
        <Dashboard />
      </Suspense>

      <Link href="/library" className="card-link mt-6 flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-lg font-bold">Self-learning library</p>
          <p className="text-sm text-muted">30 Copilot lessons with labs and quizzes, plus the optional Order Desk app track.</p>
        </div>
        <span className="text-2xl text-brand">&rarr;</span>
      </Link>
    </main>
  );
}
