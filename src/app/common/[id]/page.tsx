import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { formatDate } from "@/days/registry";
import { COMMON_CONTENT, getCommonDay } from "@/program/common";
import { Section, CodeBlock } from "@/components/Section";
import { LabDone } from "@/components/ProgramActions";

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

async function DayContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const day = getCommonDay(id);
  const content = COMMON_CONTENT[id];
  if (!day || !content) notFound();

  await connection(); // depends on the signed-in user
  const user = await currentUser();
  const facilitator = await actingFacilitator(user?.email);
  let done = false;
  let note = "";
  if (user) {
    try {
      const sql = await db();
      const rows = await sql`SELECT note FROM completions WHERE email = ${user.email} AND activity = ${id}`;
      done = rows.length > 0;
      note = (rows[0]?.note as string | null) ?? "";
    } catch {
      // The content still shows if the status cannot be read; the button just starts unchecked.
    }
  }

  return (
    <>
      <p className="mt-4 text-sm text-muted">
        Common day {day.day} | {formatDate(day.date)} | {day.length} | all teams together
      </p>
      <h1 className="mb-2 mt-1 text-3xl font-extrabold tracking-tight">
        Day {day.day}: {day.title}
      </h1>
      <p className="mb-8 text-muted">{content.objective}</p>

      <div className="space-y-6">
        <Section title="Before you come">
          <List items={content.before} />
        </Section>

        <Section title="Teach">
          <div className="space-y-6">
            {content.teach.map((t) => (
              <div key={t.title} className="space-y-2">
                <h3 className="font-semibold">{t.title}</h3>
                <List items={t.points} />
                {t.example && <CodeBlock label="Example">{t.example}</CodeBlock>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Demo">
          <List items={content.demo} ordered />
        </Section>

        <Section title={day.gate ? "Gate tasks" : "Lab: on your team's own work"}>
          <List items={content.lab.steps} ordered />
          <p className="pt-2 text-sm font-semibold">You are done when:</p>
          <List items={content.lab.doneWhen} />
          <LabDone id={id} label={day.gate ? "I took the gate" : "I completed this lab"} initialDone={done} initialNote={note} />
        </Section>

        <Section title="Share">
          <p className="text-sm">{content.share}</p>
        </Section>

        <Section title="Homework and going deeper">
          <List items={content.homework} />
        </Section>

        {facilitator && (
          <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            <p className="mb-2 font-semibold">Facilitator only</p>
            <List items={content.facilitator} />
          </aside>
        )}
      </div>
    </>
  );
}

export default function CommonDayPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/common" className="link text-sm">
        Common days
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <DayContent params={params} />
      </Suspense>
    </main>
  );
}
