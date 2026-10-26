import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { loadMine } from "@/lib/program";
import type { Sql } from "@/lib/assign";
import { currentUser } from "@/lib/user";
import { todayISO } from "@/lib/schedule";
import { DAYS, formatDate } from "@/days/registry";
import type { PainPoint } from "@/lib/assign";
import { EVENTS, WEEKS, currentWeek, eventsOn, getWeek, libraryFor, nextEvent, type ProgramEvent } from "@/program/calendar";
import { LabDone, PainPointCard, PainPointView, SubmissionForm, type SubmissionData } from "@/components/ProgramActions";

export const metadata = { title: "My week" };

type Submission = SubmissionData & { week: number; submitted_at: string };

async function MyWeek() {
  await connection(); // depends on today's date and the signed-in user
  const user = await currentUser();
  if (!user) redirect("/login");

  const today = todayISO();
  const { completions: comps, submissions: subs, assignments: assigns } = await loadMine((await db()) as unknown as Sql, user.email);
  const done = new Map(comps.map((c) => [c.activity as string, (c.note as string | null) ?? ""]));
  const submissions = new Map((subs as unknown as Submission[]).map((s) => [s.week, s]));
  const painPoints = new Map(assigns.map((a) => [a.week as number, { id: a.id, ...(a.data as object) } as PainPoint]));

  const week = currentWeek(today);
  const info = getWeek(week);
  const todays = eventsOn(today);
  const upcoming = nextEvent(today);

  const eventCard = (e: ProgramEvent) => (
    <section key={e.id} className="card space-y-2 p-6">
      <h3 className="text-lg font-bold">{e.title}</h3>
      {e.skill && (
        <p className="text-sm">
          <b>What we cover:</b> {e.skill}
        </p>
      )}
      {e.lab && (
        <p className="text-sm">
          <b>Your lab:</b> {e.lab}
        </p>
      )}
      {libraryFor(e.id).length > 0 && (
        <p className="text-sm text-muted">
          Go deeper:{" "}
          {libraryFor(e.id).map((n, i) => (
            <span key={n}>
              {i > 0 && ", "}
              <Link href={`/days/${n}`} className="link">
                Day {n}: {DAYS.find((d) => d.day === n)?.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      {e.kind === "submit" ? (
        <>
          <p className="text-sm text-muted">
            Submit your deployed app for week {e.week}, then tell us the challenge you faced and how you solved it. After this, get your next pain point below.
          </p>
          <SubmissionForm week={e.week} initial={submissions.get(e.week) ?? null} due={getWeek(e.week)!.due} />
        </>
      ) : (
        <LabDone
          key={e.id + done.has(e.id)}
          id={e.id}
          label={e.kind === "session" ? "I completed this lab" : e.kind === "call" ? "I finished and deployed my app" : "I took part"}
          initialDone={done.has(e.id)}
          initialNote={done.get(e.id) ?? ""}
        />
      )}
    </section>
  );

  const status = (e: ProgramEvent) => {
    if (e.kind === "submit") {
      const s = submissions.get(e.week);
      if (s) return <span className="text-emerald-700">Submitted: <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.url}</a></span>;
      return today >= e.date ? <span className="text-rose-600">Not submitted</span> : <span className="text-muted">Upcoming</span>;
    }
    if (done.has(e.id)) return <span className="font-semibold text-emerald-700">Completed</span>;
    if (today > e.date) return <span className="text-rose-600">Not done</span>;
    return today === e.date ? <span className="chip-today">Today</span> : <span className="text-muted">Upcoming</span>;
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-muted">{formatDate(today)}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">My week</h1>
        <p className="mt-1 text-muted">
          {info ? (
            <>
              Week {week} of {WEEKS.length}. This week&apos;s app: <b>{info.feature}</b>. Due {formatDate(info.due)}.
            </>
          ) : (
            <>The program starts on {formatDate(WEEKS[0].assignOpens)}.</>
          )}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Today</h2>
        {todays.length > 0 ? (
          todays.map(eventCard)
        ) : (
          <p className="card border-dashed p-5 text-sm text-muted">
            Nothing is scheduled today.
            {upcoming && <> Next: <b>{upcoming.title}</b> on {formatDate(upcoming.date)}.</>}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">{info ? `Week ${week} pain point` : "Your pain point"}</h2>
        {info ? (
          <PainPointCard key={`${week}${painPoints.has(week)}`} initial={painPoints.get(week) ?? null} open opensOn={formatDate(info.assignOpens)} />
        ) : (
          <PainPointCard initial={null} open={false} opensOn={formatDate(WEEKS[0].assignOpens)} />
        )}
      </section>

      {[...painPoints.entries()].filter(([w]) => w !== week).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Earlier pain points</h2>
          {[...painPoints.entries()]
            .filter(([w]) => w !== week)
            .sort(([a], [b]) => a - b)
            .map(([w, p]) => (
              <div key={w}>
                <p className="mb-1 text-sm font-semibold">Week {w}</p>
                <PainPointView p={p} />
              </div>
            ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">My progress</h2>
        <table className="card w-full overflow-hidden text-sm">
          <tbody>
            {EVENTS.map((e) => (
              <tr key={e.id} className="border-b border-line align-top">
                <td className="w-28 py-1 pr-3 text-muted">{formatDate(e.date)}</td>
                <td className="pr-3">{e.title}</td>
                <td>{status(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-sm text-muted">
        Earlier Copilot lessons (the 30-day library) are still available for self-learning:{" "}
        <Link href="/library" className="link">
          open the library
        </Link>
        .
      </p>
    </div>
  );
}

export default function TodayPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Suspense fallback={<p className="text-zinc-500">Loading...</p>}>
        <MyWeek />
      </Suspense>
    </main>
  );
}
