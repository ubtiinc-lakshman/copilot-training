import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { peQuizOf, peUnitDone } from "@/lib/pe";
import { loadPeState } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import { allUnits } from "@/program/pe";

export const metadata = { title: "My progress | Prompt Engineering" };

async function Progress() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  if (!user) return <p className="mt-6 text-muted">Sign in to see your progress.</p>;
  const state = await loadPeState((await db()) as unknown as Sql, user.email);
  const submitted = new Set(state.submitted);
  const passed = new Set(state.passed);
  const units = allUnits();
  const done = units.filter((u) => peUnitDone(u.id, submitted, passed));

  return (
    <>
      <p className="mt-2 text-muted">
        You are on level {state.level}. {done.length ? `${done.length} unit${done.length > 1 ? "s" : ""} complete.` : "No unit complete yet."}
      </p>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="p-3">Unit</th>
              <th className="p-3">Lab</th>
              <th className="p-3">Quiz (best)</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const q = state.best[peQuizOf(u.id)];
              const isDone = peUnitDone(u.id, submitted, passed);
              if (!isDone && !state.subs.some((x) => x.unit === u.id) && q === undefined) return null;
              return (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="p-3">{u.title}</td>
                  <td className="p-3">{(() => { const sub = state.subs.find((x) => x.unit === u.id); return sub ? (sub.status === "approved" ? "Approved" : sub.status === "changes" ? "Sent back" : "Waiting for review") : "-"; })()}</td>
                  <td className="p-3">{q === undefined ? "-" : `${q}%`}</td>
                  <td className="p-3">{isDone ? <span className="chip-done">Complete</span> : <span className="chip-idle">In progress</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function MePage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering" className="link text-sm">
        Prompt Engineering
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">My progress</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Progress />
      </Suspense>
    </main>
  );
}
