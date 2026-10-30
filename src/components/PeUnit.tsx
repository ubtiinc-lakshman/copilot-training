import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { PE_PASS_PERCENT, peQuizOf } from "@/lib/pe";
import { loadPeState } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import type { Unit } from "@/program/pe";
import { Section, CodeBlock } from "@/components/Section";
import { getPeDocTitles } from "@/lib/peDb";
import PeLabForm from "@/components/PeLabForm";
import Quiz from "@/components/Quiz";

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`ml-5 space-y-1 text-sm ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </Tag>
  );
};

// One Prompt Engineering unit: content, lab submission and quiz. Locked until the person has reached the level of the unit.
export default async function PeUnit({ unit }: { unit: Unit }) {
  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const facilitator = await actingFacilitator(user?.email);
  const sql = (await db()) as unknown as Sql;
  const state = user ? await loadPeState(sql, user.email) : null;
  const level = state?.level ?? 1;

  if (unit.level > level && !facilitator) {
    return (
      <div className="card mt-6 p-6 text-sm">
        <p className="font-semibold">Level {unit.level} is locked</p>
        <p className="mt-1 text-muted">
          {unit.level === 2 ? "Finish Level 1: submit the Prompt Rescue lab and pass its quiz with at least " : "Finish one Level 2 track: submit its lab and pass its quiz with at least "}
          {PE_PASS_PERCENT}%.
        </p>
        <Link href="/courses/prompt-engineering" className="link mt-3 inline-block">
          Back to the course
        </Link>
      </div>
    );
  }

  const titles = await getPeDocTitles(sql, unit.blocks.flatMap((b) => b.docs ?? []));
  const mine = state?.subs.find((s) => s.unit === unit.id);
  const quiz = peQuizOf(unit.id);
  const best = state?.best[quiz];
  const passed = state?.passed.includes(quiz);

  return (
    <>
      <p className="mt-4 text-sm text-muted">Level {unit.level}</p>
      <h1 className="mb-2 mt-1 text-3xl font-extrabold tracking-tight">{unit.title}</h1>
      <p className="mb-8 text-muted">{unit.objective}</p>
      <div className="space-y-6">
        {unit.blocks.map((b) => (
          <Section key={b.title} title={b.title}>
            <List items={b.points} />
            {b.example && <CodeBlock label="Example">{b.example}</CodeBlock>}
            {b.docs && (
              <ul className="ml-5 list-disc space-y-1 text-sm">
                {b.docs.map((slug) => (
                  <li key={slug}>
                    {titles.has(slug) ? (
                      <Link href={`/courses/prompt-engineering/library/${slug}`} className="link">
                        {titles.get(slug)}
                      </Link>
                    ) : (
                      <span className="text-muted">{slug} (not loaded yet)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ))}
        <Section title="Lab">
          <p className="text-sm">{unit.lab.scenario}</p>
          <List items={unit.lab.tasks} ordered />
          <p className="pt-2 text-sm font-semibold">You are done when:</p>
          <List items={unit.lab.doneWhen} />
          {mine && (
            <p className={`rounded-xl border p-3 text-sm ${mine.status === "approved" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : mine.status === "changes" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-line text-muted"}`}>
              <span className="font-semibold">{mine.status === "approved" ? "Approved by a facilitator." : mine.status === "changes" ? "Sent back for changes. Update your lab and resubmit." : "Submitted. Waiting for a facilitator to review."}</span>
              {mine.feedback ? <span className="mt-1 block whitespace-pre-wrap">{String(mine.feedback)}</span> : null}
            </p>
          )}
          <PeLabForm unit={unit.id} initial={(mine?.fields as Record<string, string> | undefined) ?? null} />
        </Section>
        <Section title={`Quiz (pass mark ${PE_PASS_PERCENT}%)`}>
          <p className="text-sm text-muted">
            {passed ? `Passed (best ${best}%).` : best !== undefined ? `Best so far ${best}%.` : "Not attempted yet."} You can retake it. A unit is complete when the lab is submitted and the quiz is passed.
          </p>
          <Quiz day={quiz} passPercent={PE_PASS_PERCENT} />
        </Section>
      </div>
    </>
  );
}
