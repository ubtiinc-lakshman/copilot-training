import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isFacilitator } from "@/auth";
import { db } from "@/lib/db";
import { loadMine } from "@/lib/program";
import { initialsOf, loadProfile } from "@/lib/profile";
import type { Sql } from "@/lib/assign";
import { COURSES } from "@/courses";
import { DAYS } from "@/days/registry";
import { COMMON_DAYS } from "@/program/common";

export const metadata = { title: "My profile" };

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rounded-xl border border-line p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-1 text-xl font-bold">{value}</p>
    {hint && <p className="text-xs text-muted">{hint}</p>}
  </div>
);

async function Profile() {
  await connection(); // depends on the signed-in user
  const session = (await auth())?.user;
  if (!session?.email) redirect("/login");
  const email = session.email.toLowerCase();
  const name = session.name ?? email;
  const sql = (await db()) as unknown as Sql;
  const [mine, profile] = await Promise.all([loadMine(sql, email), loadProfile(sql, email)]);

  const done = new Set(mine.completions.map((c) => c.activity as string));
  const commonDone = COMMON_DAYS.filter((d) => done.has(d.id)).length;
  const labsDone = DAYS.filter((d) => done.has(`lab-${d.day}`)).length;
  const facilitator = isFacilitator(email);

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="h-24" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }} />
        <div className="flex flex-wrap items-end gap-4 px-6 pb-6">
          <div
            className="-mt-10 grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-surface text-2xl font-bold text-white"
            style={{ backgroundImage: "linear-gradient(135deg, var(--brand-2), var(--brand))" }}
          >
            {initialsOf(name)}
          </div>
          <div className="min-w-0 flex-1 pt-2">
            <h1 className="truncate text-2xl font-bold">{name}</h1>
            <p className="truncate text-sm text-muted">{email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={facilitator ? "chip-brand" : "chip-idle"}>{facilitator ? "Facilitator" : "Participant"}</span>
              {profile.team && <span className="chip-idle">{profile.team}</span>}
              {profile.github && (
                <a className="chip-idle hover:text-brand" href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">
                  GitHub: {profile.github}
                </a>
              )}
              {!profile.onRoster && <span className="chip-late">Not on the participant list</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">My courses</h2>
        {COURSES.map((c) => (
          <div key={c.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">{c.title}</h3>
              {c.status === "live" ? (
                <Link href={c.href} className="link text-sm">Open course</Link>
              ) : (
                <span className="chip-idle">Coming soon</span>
              )}
            </div>
            {c.id === "copilot" && (
              <>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="Common days" value={`${commonDone} / ${COMMON_DAYS.length}`} hint="Marked complete" />
                  <Stat label="Library labs" value={`${labsDone} / ${DAYS.length}`} hint="Marked complete" />
                  <Stat label="Quiz average" value={profile.quizAverage === null ? "-" : `${profile.quizAverage}%`} hint={`${profile.quizzesTaken} quiz${profile.quizzesTaken === 1 ? "" : "zes"} taken`} />
                  <Stat label="Lessons opened" value={String(profile.daysAttended)} hint="Library lessons" />
                </div>
                <p className="mt-4 text-sm">
                  <Link href="/courses/copilot/me" className="link">Weekly apps and certification progress</Link>
                </p>
              </>
            )}
            {c.status !== "live" && <p className="mt-2 text-sm text-muted">{c.blurb}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <Profile />
      </Suspense>
    </main>
  );
}
