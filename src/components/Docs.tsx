import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { getPeDoc, listPeDocs } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import Markdown from "@/components/Markdown";

// The document library of a course (table pe_docs). `base` is the page the documents live under, for example /courses/copilot/docs.
export async function DocList({ course, base }: { course: string; base: string }) {
  await connection(); // depends on the signed-in user
  const facilitator = await actingFacilitator((await currentUser())?.email);
  let docs: Record<string, unknown>[] = [];
  try {
    docs = await listPeDocs((await db()) as unknown as Sql, facilitator, course);
  } catch {
    // An empty library is shown if the documents cannot be read.
  }
  if (!docs.length) return <p className="mt-6 text-muted">The library has not been loaded yet.</p>;

  const sections = new Map<string, Record<string, unknown>[]>();
  for (const d of docs) sections.set(d.section as string, [...(sections.get(d.section as string) ?? []), d]);
  return (
    <div className="mt-6 space-y-6">
      {[...sections].map(([section, items]) => (
        <section key={section} className="card p-5">
          <h2 className="text-lg font-bold">
            {section} {items[0].audience === "facilitator" && <span className="chip-late ml-2 align-middle">Facilitators only</span>}
          </h2>
          <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
            {items.map((d) => (
              <li key={d.slug as string}>
                <Link href={`${base}/${d.slug}`} className="link">
                  {d.title as string}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export async function DocView({ course, slug }: { course: string; slug: string }) {
  await connection(); // depends on the signed-in user
  const facilitator = await actingFacilitator((await currentUser())?.email);
  const doc = await getPeDoc((await db()) as unknown as Sql, slug, facilitator, course);
  if (!doc) notFound();
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {doc.section} {doc.audience === "facilitator" && <span className="chip-late ml-2">Facilitators only</span>}
      </p>
      <div className="card mt-3 max-w-4xl p-6">
        <Markdown source={doc.body} />
      </div>
    </>
  );
}
