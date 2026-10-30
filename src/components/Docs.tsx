import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { actingFacilitator } from "@/lib/viewMode";
import { getPeDoc, listPeDocs } from "@/lib/peDb";
import type { Sql } from "@/lib/assign";
import Markdown from "@/components/Markdown";
import CopyButton from "@/components/CopyButton";

// What each group of documents is for, and how to use it. Shown on the library and on each document of the group.
const ABOUT: Record<string, { what: string; steps?: string[] }> = {
  "Team playbooks": { what: "One guide per team: what to use prompts for in your work, with examples. Read yours before your track." },
  Playbooks: { what: "One guide per role: what to use Copilot for in your work, with examples. Read yours before your track." },
  "Lab workbooks": {
    what: "The long version of each lab: tasks, prompt templates and success criteria. Do the work, then submit it on the lab page of your level or session.",
    steps: ["Read the tasks and the success criteria.", "Do the lab in your own editor, using sanitised or invented data only.", "Submit your result on the lab page, not here."],
  },
  Reference: { what: "Cheatsheets, principles, safety rules and the glossary. Keep one open while you work." },
  "Prompt repository": {
    what: "Tested prompt templates. Open one, copy the template, fill in the placeholders and run it.",
    steps: ["Press Copy on the Prompt Template block.", "Replace every [PLACEHOLDER] with your own details (no real customer data or secrets).", "Run it in Copilot Chat or your AI tool.", "Validate the answer before you use it, then refine the prompt once."],
  },
  "Sample projects": {
    what: "Small practice projects you create in minutes, so you have real files to work on.",
    steps: [
      "Make an empty folder and open it in VS Code.",
      "For each file below: create a file with the path in the heading, press Copy on its block and paste.",
      "Or faster: open Copilot Chat in Agent mode, press Copy whole page (top right) and paste it with the line below.",
      "Check the files exist, then do the track lab on them. The data is invented; keep it that way.",
    ],
  },
};
// Ascending order inside a group: Lab 1, 2, 3 ... 10, 11 (numbers by value, not as text), and Basic, Intermediate, Advanced in that order.
const orderKey = (slug: string) => slug.replace(/^((?:gc-)?)updated-lab-(\d+)-/, "$1lab-$2-z-").replace("basic", "level-1-basic").replace("intermediate", "level-2-intermediate").replace("advanced", "level-3-advanced");
const FACILITATOR_ONLY = "For facilitators. Participants do not see this.";
const aboutOf = (section: string, facilitator: boolean) => (facilitator ? { what: FACILITATOR_ONLY } : ABOUT[section]);

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
  for (const d of [...docs].sort((x, y) => orderKey(x.slug as string).localeCompare(orderKey(y.slug as string), undefined, { numeric: true }))) {
    sections.set(d.section as string, [...(sections.get(d.section as string) ?? []), d]);
  }
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {[...sections].map(([section, items]) => {
        const only = items[0].audience === "facilitator";
        const about = aboutOf(section, only);
        return (
          <section key={section} className="card p-5">
            <h2 className="text-lg font-bold">
              {section} {only && <span className="chip-late ml-2 align-middle">Facilitators only</span>}
            </h2>
            {about && <p className="mt-1 text-sm text-muted">{about.what}</p>}
            <ul className="mt-3 space-y-1 text-sm">
              {items.map((d) => (
                <li key={d.slug as string}>
                  <Link href={`${base}/${d.slug}`} className="link">
                    {d.title as string}{(d.slug as string).startsWith("updated-") ? " (updated version)" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function DocView({ course, slug, base }: { course: string; slug: string; base: string }) {
  await connection(); // depends on the signed-in user
  const facilitator = await actingFacilitator((await currentUser())?.email);
  const sql = (await db()) as unknown as Sql;
  const [doc, visible] = await Promise.all([getPeDoc(sql, slug, facilitator, course), listPeDocs(sql, facilitator, course)]);
  if (!doc) notFound();

  // Links between the original files ("Core_Principles.md") become links to the matching page, when this reader may open it.
  const slugs = visible.map((d) => d.slug as string);
  const resolveHref = (href: string) => {
    if (!/\.md(#.*)?$/i.test(href)) return null;
    const name = slugOf(href.split("#")[0].split("/").pop()!.replace(/\.md$/i, ""));
    const candidates = course === "copilot" ? [`gc-${name}`] : [name, ...slugs.filter((s) => s.endsWith(`-${name}`))];
    const hit = candidates.find((c) => slugs.includes(c));
    return hit ? `${base}/${hit}` : null;
  };

  const about = aboutOf(doc.section, doc.audience === "facilitator");
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {doc.section} {doc.audience === "facilitator" && <span className="chip-late ml-2">Facilitators only</span>}
        </p>
        <CopyButton text={doc.body} label="Copy whole page" className="btn-ghost" />
      </div>
      {about?.steps && (
        <div className="card mt-3 border-brand/40 p-5 text-sm">
          <p className="font-semibold">How to use this page</p>
          <p className="mt-1 text-muted">{about.what}</p>
          <ol className="ml-5 mt-2 list-decimal space-y-1">
            {about.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          {doc.section === "Sample projects" && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <code className="rounded bg-black/5 px-2 py-1 text-xs dark:bg-white/10">Create the following project exactly as listed, one file per heading, using the path in the heading and the code block as the content.</code>
              <CopyButton text="Create the following project exactly as listed, one file per heading, using the path in the heading and the code block as the content." label="Copy this line" />
            </div>
          )}
        </div>
      )}
      <div className="card mt-3 w-full p-6">
        <Markdown source={doc.body} resolveHref={resolveHref} />
      </div>
    </>
  );
}
