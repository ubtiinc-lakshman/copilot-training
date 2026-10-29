import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { formatDate } from "@/days/registry";
import { getEvent, libraryFor } from "@/program/calendar";
import { getSession } from "@/program/sessions";
import { DAYS } from "@/days/registry";
import { Section, CodeBlock } from "@/components/Section";
import { LabDone } from "@/components/ProgramActions";
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

async function SessionContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  const content = getSession(id);
  if (!event || event.kind !== "session" || !content) notFound();

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
  const quizDay = 100 + Number(id.slice(1));

  return (
    <>
      <p className="mt-4 text-sm text-muted">
        Week {event.week} | {formatDate(event.date)} | In person, 60 min: teach 15, demo 10, lab 25, quiz 5, share 5
      </p>
      <h1 className="mb-2 mt-1 text-3xl font-extrabold tracking-tight">
        Session {Number(id.slice(1))}: {event.title}
      </h1>
      <p className="mb-8 text-muted">{content.objective}</p>

      <div className="space-y-6">
        <Section title="Before you come">
          <List items={content.before} />
        </Section>

        <Section title="Teach (15 min)">
          <div className="space-y-6">
            {content.teach.map((t) => (
              <div key={t.title} className="space-y-2">
                <h3 className="font-semibold">{t.title}</h3>
                <List items={t.points} />
                {t.example && <CodeBlock label="Example prompt">{t.example}</CodeBlock>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Demo (10 min)">
          <List items={content.demo} ordered />
        </Section>

        <Section title="Lab (25 min): on your own app">
          <List items={content.lab.steps} ordered />
          <p className="pt-2 text-sm font-semibold">You are done when:</p>
          <List items={content.lab.doneWhen} />
          <LabDone id={id} label="I completed this lab" initialDone={done} initialNote={note} />
        </Section>

        <Section title="Quiz (5 min)">
          <Quiz day={quizDay} />
        </Section>

        <Section title="Share (5 min)">
          <p className="text-sm">{content.share}</p>
        </Section>

        <Section title="Homework and going deeper">
          <List items={content.homework} />
          {libraryFor(id).length > 0 && (
            <p className="text-sm text-muted">
              Library:{" "}
              {libraryFor(id).map((n, i) => (
                <span key={n}>
                  {i > 0 && ", "}
                  <Link href={`/days/${n}`} className="link">
                    Day {n}: {DAYS.find((d) => d.day === n)?.title}
                  </Link>
                </span>
              ))}
            </p>
          )}
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

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/today" className="link text-sm">
        My week
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <SessionContent params={params} />
      </Suspense>
    </main>
  );
}
