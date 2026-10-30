import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { levelOf, loadMine } from "@/lib/program";
import type { Sql } from "@/lib/assign";
import { currentUser } from "@/lib/user";
import { DAYS } from "@/days/registry";
import { SESSIONS } from "@/program/sessions";
import { GT_TRACKS, gtTrackDone } from "@/lib/gt";
import { loadGtState } from "@/lib/gtDb";
import { actingFacilitator } from "@/lib/viewMode";
import { COMMON_DAYS } from "@/program/common";
import { TRACKS as GT_TRACK_INFO } from "@/program/tracks";
import { EVENTS, WEEKS, libraryFor, trackedEvents } from "@/program/calendar";
import { PageSkeleton } from "@/components/Skeleton";

const KIND = { session: "Session", call: "Live call", finale: "Finale", submit: "Submit" } as const;

async function Dashboard() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const mine = user ? await loadMine((await db()) as unknown as Sql, user.email) : null;
  const facilitator = await actingFacilitator(user?.email);
  const gt = user ? await loadGtState((await db()) as unknown as Sql, user.email) : null;
  const done = new Set((mine?.completions ?? []).map((c) => c.activity as string));
  const submitted = new Set((mine?.submissions ?? []).map((s) => s.week as number));
  const titles = new Map((mine?.assignments ?? []).map((a) => [a.week as number, (a.data as { title: string }).title]));

  const week = levelOf(submitted); // the level you are on: submit its app to open the next
  const doneCount = trackedEvents.filter((e) => done.has(e.id)).length;
  const pct = Math.round((doneCount / trackedEvents.length) * 100);

  const state = (id: string, eventWeek: number) =>
    done.has(id) ? <span className="chip-done">Done</span> : eventWeek <= week ? <span className="chip-today">To do</span> : <span className="chip-idle">Locked</span>;

  // The path: Common days (Day 0-7) -> Team track (opens when the Day 7 gate is marked complete) -> Weekly apps (self-paced, open any time).
  const commonDone = COMMON_DAYS.filter((d) => done.has(d.id)).length;
  const gateDone = done.has("c7");
  const trackSubmitted = new Set(gt?.submitted ?? []);
  const trackPassed = new Set(gt?.passed ?? []);
  const tracksDone = GT_TRACKS.filter((t) => gtTrackDone(t, trackSubmitted, trackPassed));
  const myTrack = GT_TRACKS.map((t) => ({ t, labs: [1, 2, 3, 4, 5].filter((n) => trackSubmitted.has(`gt-${t}-${n}`)).length })).sort((a, b) => b.labs - a.labs)[0];
  const stages = [
    {
      n: 1, title: "Common days", href: "/courses/copilot/common", open: true, done: gateDone,
      text: `${commonDone} of ${COMMON_DAYS.length} days done. Day 0 to Day 7 for every team; the Day 7 gate opens your track.`,
    },
    {
      n: 2, title: "Team track", href: "/courses/copilot/tracks", open: gateDone || facilitator, done: tracksDone.length > 0,
      text: !(gateDone || facilitator) ? "Opens when you mark the Day 7 gate complete." : tracksDone.length ? `${tracksDone.map((t) => GT_TRACK_INFO.find((x) => x.id === t)?.name).join(", ")} complete.` : myTrack?.labs ? `${GT_TRACK_INFO.find((x) => x.id === myTrack.t)?.name}: ${myTrack.labs} of 5 labs submitted.` : "Open. Pick the track for your team: five sessions, labs reviewed by a facilitator, and a quiz.",
    },
    {
      n: 3, title: "Weekly apps", href: "/courses/copilot/today", open: !!gt?.stage3 || facilitator, done: submitted.size === WEEKS.length,
      text: !(gt?.stage3 || facilitator) ? "Opens when you finish your team track." : `Self-paced. ${submitted.size} of ${WEEKS.length} apps submitted.`,
    },
  ];

  return (
    <>
      <h2 className="mb-3 mt-8 text-xl font-bold">Your path</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map((s) => (
          <div key={s.n} className="card flex flex-col p-5">
            <span className={s.done ? "chip-done w-fit" : s.open ? "chip-today w-fit" : "chip-idle w-fit"}>{s.done ? "Done" : s.open ? "Open" : "Locked"}</span>
            <h3 className="mt-3 font-bold">Stage {s.n}: {s.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted">{s.text}</p>
            {s.open ? <Link href={s.href} className="btn-primary mt-4 w-fit">Open</Link> : <p className="mt-4 text-xs text-muted">Finish stage {s.n - 1} first.</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
        <Link href="/courses/copilot/today" className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition hover:shadow-xl" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          <p className="text-sm/6 opacity-80">Your level</p>
          <p className="mt-1 text-2xl font-bold">
            Level {week}: {WEEKS[week - 1].feature}
          </p>
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">Continue &rarr;</p>
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
          const started = w.week <= week;
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
                    <p className="text-xs text-muted">Level {w.week}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {current && <span className="chip-brand">Your level</span>}
                  {submitted.has(w.week) ? <span className="chip-done">Submitted</span> : <span className="chip-idle">Not submitted</span>}
                </div>
              </div>

              <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm">
                {titles.has(w.week) ? (
                  <>
                    <span className="text-muted">Your pain point:</span> <b>{titles.get(w.week)}</b>
                  </>
                ) : started ? (
                  <Link href="/courses/copilot/today" className="link">
                    Get your pain point &rarr;
                  </Link>
                ) : (
                  <span className="text-muted">Opens when you submit level {w.week - 1}</span>
                )}
              </p>

              <ul className="mt-3 divide-y divide-line text-sm">
                {evs.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted">{KIND[e.kind]}</span>
                      {SESSIONS[e.id] ? (
                        <Link href={`/courses/copilot/sessions/${e.id}`} className="link">
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
                              <Link href={`/courses/copilot/days/${n}`} className="link" title={DAYS.find((d) => d.day === n)?.title}>
                                Day {n}
                              </Link>
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    {state(e.id, e.week)}
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
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <p className="chip-brand">GitHub Copilot</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
        Learn Copilot{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          together
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">Eight common days for everyone. The weekly app builds and the library are there to practise on your own time.</p>

      <Link href="/courses/copilot/common" className="card-link mt-8 flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-lg font-bold">Common GitHub Copilot days (main program)</p>
          <p className="text-sm text-muted">Eight shared days for all teams, full days, Mon-Fri from Nov 2: terms, prompts, security, agents, and a practical gate.</p>
        </div>
        <span className="text-2xl text-brand">&rarr;</span>
      </Link>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Self-paced: build an app every week</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">Optional practice. Each lab teaches one skill that you use on your own app, deploy, and submit. Dates are a suggested pace; there are no live sessions.</p>

      <Suspense fallback={<PageSkeleton />}>
        <Dashboard />
      </Suspense>

      <Link href="/courses/copilot/library" className="card-link mt-6 flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-lg font-bold">Self-learning library</p>
          <p className="text-sm text-muted">30 Copilot lessons with labs and quizzes, plus the optional Order Desk app track.</p>
        </div>
        <span className="text-2xl text-brand">&rarr;</span>
      </Link>
    </main>
  );
}
