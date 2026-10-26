import Link from "next/link";
import { CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import { PREREQS, TRACK, TRACK_INTRO } from "@/track/tasks";

export const metadata = { title: "Optional app track: Order Desk" };

export default function TrackPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/library" className="text-sm link">
        Library
      </Link>
      <h1 className="mb-3 mt-4 text-3xl font-extrabold tracking-tight">Optional app track: Order Desk</h1>
      <div className="mb-4"><Callout>Not required. The standalone day labs are the training; this is for people who want to build a real app alongside.</Callout></div>
      <ul className="ml-5 list-disc space-y-1">
        {TRACK_INTRO.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <section className="card mt-8 space-y-2 p-6">
        <h2 className="text-xl font-bold">Prerequisites (sort these out before Day 2)</h2>
        <table className="w-full text-sm">
          <tbody>
            {PREREQS.map((p) => (
              <tr key={p.name} className="border-b border-line align-top">
                <td className="w-48 py-2 pr-4 font-semibold">{p.name}</td>
                <td className="pr-4">{p.need}</td>
                <td>{p.check && <code className="text-xs">{p.check}</code>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CodeBlock label="Quick check (from a clone of the training repo)">{"node app-track/check-prereqs.mjs"}</CodeBlock>
      </section>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {TRACK.map((t) => (
          <a key={t.day} href={`#day-${t.day}`} className="chip-brand hover:brightness-95">
            Day {t.day}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {TRACK.map((t) => (
          <section key={t.day} id={`day-${t.day}`} className="card scroll-mt-20 space-y-3 p-6">
            <h2 className="text-xl font-bold">
              Day {t.day}: {t.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Dev</h3>
                <ul className="ml-5 list-disc space-y-1 text-sm">
                  {t.dev.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">QA</h3>
                <ul className="ml-5 list-disc space-y-1 text-sm">
                  {t.qa.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            {t.seed && (
              <p className="text-sm">
                Seed files: {t.seed.map((s) => <code key={s} className="mr-2">app-track/{s}</code>)}
              </p>
            )}
            {t.prompt && <CodeBlock label="Starter prompt">{t.prompt}</CodeBlock>}
            <h3 className="font-semibold">Done when</h3>
            <ChecklistTracker id={`track-day-${t.day}`} items={t.accept} />
            <p className="text-xs text-muted">
              Commit: <code>{t.commit}</code>
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
