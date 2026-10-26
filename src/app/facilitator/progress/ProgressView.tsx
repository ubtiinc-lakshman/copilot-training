"use client";

import { useEffect, useState } from "react";
import { WEEKS, trackedEvents } from "@/program/calendar";
import { todayISO } from "@/lib/schedule";

type Person = { email: string; name: string };
type Completion = { email: string; activity: string; note: string | null; completed_at: string };
type Assignment = { email: string; week: number; title: string; category: string; assigned_at: string };
type Submission = { email: string; week: number; url: string; challenge: string; solution: string; copilot: string; submitted_at: string };
type Data = { people: Person[]; completions: Completion[]; assignments: Assignment[]; submissions: Submission[] };

const short = (id: string) => (id.startsWith("s") ? `S${Number(id.slice(1))}` : id === "finale" ? "End" : `F${id[1]}`);

export default function ProgressView() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    const load = () =>
      fetch("/api/progress")
        .then(async (res) => ({ ok: res.ok, json: await res.json() }))
        .then(({ ok, json }) => {
          if (!live) return;
          if (!ok) return setError(json.error ?? "Failed to load");
          setError("");
          setData(json);
        });
    load();
    const t = setInterval(load, 30000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data) return <p className="text-muted">Loading...</p>;

  const today = todayISO();
  const doneSet = new Set(data.completions.map((c) => `${c.email}|${c.activity}`));
  const note = (email: string, id: string) => data.completions.find((c) => c.email === email && c.activity === id)?.note;
  const opened = trackedEvents.filter((e) => e.date <= today);
  const dueWeeks = WEEKS.filter((w) => w.assignOpens <= today);
  const subOf = (email: string, week: number) => data.submissions.find((s) => s.email === email && s.week === week);
  const pointOf = (email: string, week: number) => data.assignments.find((a) => a.email === email && a.week === week);

  const latest = opened.at(-1);
  const csv = () => {
    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      "name,email,week,pain_point,submitted_url,submitted_at,challenge,solution,copilot," + opened.map((e) => e.id).join(","),
      ...data.people.flatMap((p) =>
        dueWeeks.map((w) => {
          const s = subOf(p.email, w.week);
          const a = pointOf(p.email, w.week);
          const weekDone = opened.map((e) => (e.week === w.week ? (doneSet.has(`${p.email}|${e.id}`) ? "yes" : "no") : "")).join(",");
          return [p.name, p.email, w.week, a?.title, s?.url, s?.submitted_at, s?.challenge, s?.solution, s?.copilot].map(q).join(",") + "," + weekDone;
        }),
      ),
    ];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    link.download = "program-progress.csv";
    link.click();
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>
          {data.people.length} participants have used the site. Updates every 30 seconds. People who have not signed in yet are not listed.
        </span>
        <button className="btn-ghost !px-3 !py-1" onClick={csv}>
          Export CSV
        </button>
      </div>

      {latest && (
        <section>
          <h2 className="mb-2 text-xl font-bold">Latest: {latest.title}</h2>
          <p className="text-sm">
            <b>{data.people.filter((p) => doneSet.has(`${p.email}|${latest.id}`)).length}</b> of {data.people.length} marked it complete.{" "}
            {(() => {
              const missing = data.people.filter((p) => !doneSet.has(`${p.email}|${latest.id}`)).map((p) => p.name);
              return missing.length ? <>Not yet: {missing.join(", ")}.</> : "Everyone is done.";
            })()}
          </p>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xl font-bold">Who completed what</h2>
        <p className="mb-2 text-xs text-muted">S = session lab, F = Friday call for that week, End = finale. Hover a column for its title, a tick for the note.</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-1 pr-4">Participant</th>
                {opened.map((e) => (
                  <th key={e.id} className="px-2 text-center" title={`${e.date} ${e.title}`}>
                    {short(e.id)}
                  </th>
                ))}
                {dueWeeks.map((w) => (
                  <th key={w.week} className="px-2 text-center" title={`Week ${w.week} submission, due ${w.due}`}>
                    App {w.week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.people.map((p) => (
                <tr key={p.email} className="border-b border-line">
                  <td className="py-1 pr-4 font-semibold" title={p.email}>
                    {p.name}
                  </td>
                  {opened.map((e) => (
                    <td key={e.id} className="px-2 text-center" title={note(p.email, e.id) ?? ""}>
                      {doneSet.has(`${p.email}|${e.id}`) ? <span className="text-green-600">&#10003;</span> : <span className="text-zinc-300">-</span>}
                    </td>
                  ))}
                  {dueWeeks.map((w) => {
                    const s = subOf(p.email, w.week);
                    return (
                      <td key={w.week} className="px-2 text-center">
                        {s ? (
                          <a className="text-green-700 underline" href={s.url} target="_blank" rel="noreferrer">
                            link
                          </a>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold">Pain points given</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-1 pr-4">Participant</th>
                {dueWeeks.map((w) => (
                  <th key={w.week} className="pr-4">
                    Week {w.week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.people.map((p) => (
                <tr key={p.email} className="border-b border-line align-top">
                  <td className="py-1 pr-4 font-semibold">{p.name}</td>
                  {dueWeeks.map((w) => (
                    <td key={w.week} className="pr-4">
                      {pointOf(p.email, w.week)?.title ?? <span className="text-zinc-300">not taken</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold">Submissions ({data.submissions.length})</h2>
        <div className="space-y-3">
          {data.submissions.length === 0 && <p className="text-sm text-muted">None yet.</p>}
          {data.submissions.map((s) => {
            const who = data.people.find((p) => p.email === s.email)?.name ?? s.email;
            const due = WEEKS.find((w) => w.week === s.week)?.due ?? "";
            const late = new Date(s.submitted_at).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) > due;
            return (
              <details key={`${s.email}${s.week}`} className="rounded border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <summary className="cursor-pointer">
                  <b>Week {s.week}</b> {who} - <a className="text-blue-600 underline" href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
                  {late && <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-800">late</span>}
                </summary>
                <p className="mt-2"><b>Pain point:</b> {pointOf(s.email, s.week)?.title ?? "none assigned"}</p>
                <p className="mt-1"><b>Challenge:</b> {s.challenge}</p>
                <p className="mt-1"><b>How solved:</b> {s.solution}</p>
                <p className="mt-1"><b>Copilot use:</b> {s.copilot}</p>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
