import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { todayISO, isOpen } from "@/lib/schedule";
import { formatDate } from "@/days/registry";
import { COMMON_DAYS } from "@/program/common";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Common Copilot days" };

async function Days() {
  await connection(); // depends on today's date and the signed-in user
  const user = await currentUser();
  const done = new Set<string>();
  if (user) {
    try {
      const sql = await db();
      const rows = await sql`SELECT activity FROM completions WHERE email = ${user.email} AND activity LIKE 'c_'`;
      rows.forEach((r) => done.add(r.activity as string));
    } catch {
      // The list still shows without completion marks.
    }
  }
  const today = todayISO();
  return (
    <ul className="mt-6 space-y-3">
      {COMMON_DAYS.map((d) => (
        <li key={d.id}>
          <Link href={`/courses/copilot/common/${d.id}`} className="card-link flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs text-muted">
                Day {d.day} | {formatDate(d.date)} | {d.length}
              </p>
              <p className="font-bold">{d.title}</p>
            </div>
            {done.has(d.id) ? <span className="chip-done">Completed</span> : !isOpen(d.date) ? <span className="text-xs text-muted">Opens {formatDate(d.date)}</span> : d.date === today ? <span className="chip-done">Today</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function CommonPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Stage 1: Common days</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Eight days for all teams (Dev, QA, Power BI, Fabric/Data, AI): shared terms, fundamentals, prompts and context, everyday engineering work, security, agentic working, one guided problem and a practical gate. They run as full days, Monday to Friday, from Nov 2.
      </p>
      <Suspense fallback={<PageSkeleton />}>
        <Days />
      </Suspense>
      <p className="mt-6 max-w-2xl text-sm text-muted">
        After the Day 7 gate, <Link href="/courses/copilot/tracks" className="link">Stage 2: your team track</Link> opens (Dev, QA, Power BI, Fabric or AI), then the self-paced weekly apps.
      </p>
    </main>
  );
}
