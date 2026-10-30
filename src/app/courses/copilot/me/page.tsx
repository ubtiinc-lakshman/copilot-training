import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { levelOf, loadMine } from "@/lib/program";
import { loadProfile } from "@/lib/profile";
import type { Sql } from "@/lib/assign";
import { WEEKS, trackedEvents } from "@/program/calendar";

export const metadata = { title: "My progress | GitHub Copilot" };

function Meter({ label, value, max, target, text }: { label: string; value: number; max: number; target: number; text: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const met = max > 0 && value >= target;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className={met ? "font-semibold text-emerald-600" : "text-muted"}>{text}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundImage: met ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg, var(--brand), var(--brand-2))" }} />
      </div>
    </div>
  );
}

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="card p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    {hint && <p className="text-xs text-muted">{hint}</p>}
  </div>
);

async function Progress() {
  await connection(); // depends on the signed-in user and today's date
  const session = (await auth())?.user;
  if (!session?.email) redirect("/login");
  const email = session.email.toLowerCase();
  const sql = (await db()) as unknown as Sql;
  const [mine, profile] = await Promise.all([loadMine(sql, email), loadProfile(sql, email)]);

  const done = new Set(mine.completions.map((c) => c.activity as string));
  const subs = new Map(mine.submissions.map((s) => [s.week as number, s]));
  const level = levelOf(subs.keys()); // the weekly program is self-paced: levels open as you submit
  const opened = trackedEvents.filter((e) => e.week <= level);
  const attendedEvents = opened.filter((e) => done.has(e.id)).length;
  const titles = new Map(mine.assignments.map((a) => [a.week as number, (a.data as { title: string }).title]));

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Apps submitted" value={`${subs.size} / ${WEEKS.length}`} hint="Weekly apps" />
        <Stat label="Sessions done" value={`${attendedEvents} / ${opened.length}`} hint="Marked complete so far" />
        <Stat label="Quiz average" value={profile.quizAverage === null ? "-" : `${profile.quizAverage}%`} hint={`${profile.quizzesTaken} quiz${profile.quizzesTaken === 1 ? "" : "zes"} taken`} />
        <Stat label="Lessons opened" value={String(profile.daysAttended)} hint="Library lessons" />
      </section>

      <section className="card space-y-4 p-6">
        <div>
          <h2 className="text-xl font-bold">Certification progress</h2>
          <p className="text-sm text-muted">To be certified: at least 80% of sessions, at least 4 of 5 apps deployed and passing, quiz average 70% or more.</p>
        </div>
        <Meter label="Sessions and calls completed" value={attendedEvents} max={opened.length} target={Math.ceil(opened.length * 0.8)} text={opened.length ? `${Math.round((attendedEvents / opened.length) * 100)}% (need 80%)` : "Opens when you start level 1"} />
        <Meter label="Apps submitted" value={subs.size} max={WEEKS.length} target={4} text={`${subs.size} of ${WEEKS.length} (need 4)`} />
        <Meter label="Quiz average" value={profile.quizAverage ?? 0} max={100} target={70} text={profile.quizAverage === null ? "No quiz yet (need 70%)" : `${profile.quizAverage}% (need 70%)`} />
      </section>

      <section className="card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">My apps</h2>
          <Link href="/courses/copilot/today" className="link text-sm">Go to Weekly apps</Link>
        </div>
        <ul className="divide-y divide-line">
          {WEEKS.map((w) => {
            const s = subs.get(w.week);
            const title = titles.get(w.week);
            const started = w.week <= level;
            return (
              <li key={w.week} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft font-bold text-brand">{w.week}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{title ?? (started ? "Pain point not taken yet" : "Opens when you submit level " + (w.week - 1))}</p>
                  <p className="text-xs text-muted">{w.feature}.</p>
                </div>
                {s ? (
                  <a className="chip-done" href={s.url as string} target="_blank" rel="noreferrer">Submitted</a>
                ) : started ? (
                  <span className="chip-today">In progress</span>
                ) : (
                  <span className="chip-idle">Locked</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function MyProgressPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-8">
      <h1 className="mb-6 text-3xl font-bold">My progress</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <Progress />
      </Suspense>
    </main>
  );
}
