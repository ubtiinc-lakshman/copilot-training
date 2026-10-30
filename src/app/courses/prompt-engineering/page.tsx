import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { PE_PASS_PERCENT } from "@/lib/pe";
import { loadPeState } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import { COURSES } from "@/courses";
import { LEVELS } from "@/program/pe";

export const metadata = { title: "Prompt Engineering | IC Training Center" };

const HREF = { 1: "l1", 2: "l2", 3: "l3" } as const;

async function Levels() {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const facilitator = await actingFacilitator(user?.email);
  let level = 1;
  if (user) {
    try {
      level = (await loadPeState((await db()) as unknown as Sql, user.email)).level;
    } catch {
      // The levels still show if progress cannot be read; only Level 1 is open then.
    }
  }
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {LEVELS.map((l) => {
        const open = facilitator || l.n <= level;
        return (
          <div key={l.n} className="card flex flex-col p-5">
            <span className={open ? "chip-done w-fit" : "chip-idle w-fit"}>{open ? (l.n === level ? "You are here" : "Open") : "Locked"}</span>
            <h2 className="mt-3 text-lg font-bold">
              Level {l.n}: {l.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-muted">{l.blurb}</p>
            {open ? (
              <Link href={`/courses/prompt-engineering/${HREF[l.n]}`} className="btn-primary mt-4 w-fit">
                Open level {l.n}
              </Link>
            ) : (
              <p className="mt-4 text-xs text-muted">Finish level {l.n - 1} first.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PromptEngineeringPage() {
  const course = COURSES.find((c) => c.id === "prompt-engineering")!;
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/" className="link text-sm">
        All courses
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{course.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{course.blurb}</p>
      <div className="card mt-6 p-5 text-sm">
        <p className="font-semibold">How it works</p>
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>Go at your own pace. Each level has content, a lab you submit and a quiz.</li>
          <li>A level is complete when its lab is submitted and its quiz is passed ({PE_PASS_PERCENT}% or more). The next level then opens.</li>
          <li>Level 2 has one track per team; do the one that matches your work. Never paste secrets or customer data into any prompt.</li>
        </ul>
      </div>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Levels />
      </Suspense>
    </main>
  );
}
