"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DAYS } from "@/days/registry";
import type { AttendanceRow, LabRow, ResultRow } from "@/lib/db";

const PASS = 70;
const GATE_ATTENDANCE = 80;
const REFRESH_MS = 15_000;

type Person = { email: string; name: string; scores: Map<number, number>; attended: Set<number>; labs: Map<number, LabRow> };

const heat = (v: number) =>
  v >= PASS ? "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200" : v >= 50 ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" : "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200";

const ago = (ms: number) => (ms < 5_000 ? "just now" : ms < 60_000 ? `${Math.round(ms / 1000)}s ago` : `${Math.round(ms / 60_000)}m ago`);

export default function ResultsView() {
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [labs, setLabs] = useState<LabRow[]>([]);
  const [refreshing, setRefreshing] = useState(true); // true during the first load too
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [auto, setAuto] = useState(true);
  const [fresh, setFresh] = useState<Set<number>>(new Set()); // attempt ids that arrived in the last refresh
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const seen = useRef<Set<number> | null>(null);

  // Progressive refresh: old data stays on screen while the next fetch runs; a failed fetch keeps it and shows a banner.
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/results", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      const ids = new Set<number>((data.rows as ResultRow[]).map((r) => r.id));
      setFresh(seen.current ? new Set([...ids].filter((id) => !seen.current!.has(id))) : new Set());
      seen.current = ids;
      setRows(data.rows);
      setAttendance(data.attendance);
      setLabs(data.labs ?? []);
      setUpdatedAt(Date.now());
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const load = useCallback(() => {
    setRefreshing(true);
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData(); // refreshing starts true, so the first load needs no extra state change
  }, [fetchData]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000); // keeps "Updated Xs ago" ticking
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    return () => clearInterval(t);
  }, [auto, load]);

  // ---- derived data ----
  const openDays = DAYS.map((d) => d.day);
  const people = new Map<string, Person>();
  const person = (email: string, name: string) => {
    let p = people.get(email);
    if (!p) people.set(email, (p = { email, name, scores: new Map(), attended: new Set(), labs: new Map() }));
    return p;
  };
  for (const r of rows ?? []) {
    const p = person(r.email, r.name);
    p.scores.set(r.day, Math.max(p.scores.get(r.day) ?? 0, r.percent)); // best attempt per day
  }
  for (const a of attendance) person(a.email, a.name).attended.add(a.day);
  for (const l of labs) person(l.email, l.name).labs.set(l.day, l);

  const quizDays = [...new Set((rows ?? []).map((r) => r.day))].sort((a, b) => a - b);
  const everyone = [...people.values()].map((p) => {
      const vals = [...p.scores.values()];
      const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
      const att = openDays.length ? Math.round((openDays.filter((d) => p.attended.has(d)).length / openDays.length) * 100) : 100;
      const day9 = p.scores.get(9);
      const status = day9 !== undefined && day9 < PASS ? "Day 9 below 70" : avg !== null && avg < PASS ? "Below 70%" : att < GATE_ATTENDANCE ? "Low attendance" : "On track";
      return { p, avg, att, status };
    });
  const stats = everyone
    .filter(({ p }) => `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.p.name.localeCompare(b.p.name));

  const allStats = [...people.values()];
  const avgs = allStats.map((p) => [...p.scores.values()]).filter((v) => v.length).map((v) => v.reduce((a, b) => a + b, 0) / v.length);
  const overallAvg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : null;
  const onTrack = everyone.filter((s) => s.status === "On track").length;

  const csv = () => {
    const lines = ["id,time,day,email,name,score,total,percent", ...rows!.map((r) => [r.id, r.created_at, r.day, r.email, `"${r.name.replace(/"/g, '""')}"`, r.score, r.total, r.percent].join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = "quiz-results.csv";
    a.click();
  };

  const btn = "rounded border border-zinc-400 px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900";
  const card = "rounded-lg border border-zinc-200 p-4 dark:border-zinc-800";

  // First load: skeleton instead of an empty page.
  if (!rows) {
    return (
      <div className="space-y-4" aria-busy={refreshing}>
        {error ? (
          <p className="text-sm text-red-600">
            {error}{" "}
            <button className="underline" onClick={load}>
              Retry
            </button>
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`${card} h-20 animate-pulse bg-zinc-100 dark:bg-zinc-900`} />
              ))}
            </div>
            <div className={`${card} h-64 animate-pulse bg-zinc-100 dark:bg-zinc-900`} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-2" aria-live="polite">
          <span className={`inline-block h-2 w-2 rounded-full ${refreshing ? "animate-pulse bg-blue-500" : error ? "bg-red-500" : auto ? "bg-green-500" : "bg-zinc-400"}`} />
          {refreshing ? "Updating..." : `Updated ${ago(now - updatedAt)}`}
        </span>
        <button className={btn} onClick={load} disabled={refreshing}>
          Refresh now
        </button>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto-refresh ({REFRESH_MS / 1000}s)
        </label>
        <button className={btn} onClick={csv}>
          Export CSV
        </button>
        {error && <span className="text-red-600">Could not refresh ({error}); showing the last data.</span>}
      </div>

      {/* summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className={card}>
          <p className="text-xs text-muted">Participants</p>
          <p className="text-2xl font-bold">{people.size}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">Quiz attempts</p>
          <p className="text-2xl font-bold">{rows.length}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">Average score</p>
          <p className="text-2xl font-bold">{overallAvg === null ? "-" : `${overallAvg}%`}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">Lab tasks completed</p>
          <p className="text-2xl font-bold">{labs.length}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-muted">On track</p>
          <p className="text-2xl font-bold">{onTrack}/{people.size}</p>
        </div>
      </div>

      {/* per-day */}
      {quizDays.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">Quiz by day</h2>
          <div className="space-y-1">
            {quizDays.map((d) => {
              const scores = allStats.map((p) => p.scores.get(d)).filter((v): v is number => v !== undefined);
              const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
              return (
                <div key={d} className="flex items-center gap-3 text-sm">
                  <span className="w-14 shrink-0">Day {d}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                    <div className={`h-full ${avg >= PASS ? "bg-green-500" : avg >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${avg}%`, transition: "width .6s" }} />
                  </div>
                  <span className="w-40 shrink-0 text-right text-muted">
                    avg {avg}% - {scores.length}/{people.size} took it
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* participants */}
      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Participants</h2>
          <input
            className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="mb-2 text-xs text-muted">
          Best score per day. Level gate: {PASS}% average, {GATE_ATTENDANCE}% attendance of the {openDays.length} day(s) opened so far; Day 9 is a hard gate at {PASS}%.
        </p>
        {people.size === 0 ? (
          <p className="text-muted">Nobody has signed in yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-300 text-left dark:border-zinc-700">
                  <th className="py-1 pr-4">Participant</th>
                  {quizDays.map((d) => (
                    <th key={d} className="px-2 text-center">D{d}</th>
                  ))}
                  <th className="px-2 text-center">Avg</th>
                  <th className="px-2 text-center">Attend.</th>
                  <th className="px-2 text-center">Labs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(({ p, avg, att, status }) => (
                  <tr key={p.email} className="border-b border-line">
                    <td className="py-1 pr-4">
                      <b>{p.name}</b>
                      <div className="text-xs text-muted">{p.email}</div>
                    </td>
                    {quizDays.map((d) => {
                      const v = p.scores.get(d);
                      return (
                        <td key={d} className="px-1 text-center">
                          {v === undefined ? <span className="text-zinc-400">-</span> : <span className={`inline-block min-w-10 rounded px-1 ${heat(v)}`}>{v}</span>}
                        </td>
                      );
                    })}
                    <td className="px-2 text-center font-semibold">{avg ?? "-"}</td>
                    <td className="px-2 text-center">{att}%</td>
                    <td className="px-2 text-center">{p.labs.size}/{DAYS.length}</td>
                    <td className={status === "On track" ? "text-green-600" : "text-red-600"}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.length === 0 && <p className="py-3 text-muted">No match.</p>}
          </div>
        )}
      </section>

      {/* lab task completion matrix */}
      {people.size > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">Lab tasks</h2>
          <p className="mb-2 text-xs text-muted">A tick means the participant marked that lesson&apos;s lab task as completed. Hover for their note.</p>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pr-4">Participant</th>
                  {DAYS.map((d) => (
                    <th key={d.day} className="px-1 text-center text-xs font-normal text-muted">{d.day}</th>
                  ))}
                  <th className="px-2 text-center text-xs font-normal text-muted">Done</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(({ p }) => (
                  <tr key={p.email} className="border-t border-line">
                    <td className="py-1 pr-4">{p.name}</td>
                    {DAYS.map((d) => {
                      const l = p.labs.get(d.day);
                      return (
                        <td key={d.day} className="px-1 text-center" title={l ? `${new Date(l.completed_at).toLocaleString()}${l.note ? ` - ${l.note}` : ""}` : "Not completed"}>
                          {l ? <span className="text-green-600">✓</span> : <span className="text-zinc-300 dark:text-zinc-700">·</span>}
                        </td>
                      );
                    })}
                    <td className="px-2 text-center font-semibold">{p.labs.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* attendance matrix */}
      {people.size > 0 && openDays.length > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-bold">Attendance</h2>
          <p className="mb-2 text-xs text-muted">A dot means the participant opened that day&apos;s page while signed in.</p>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pr-4">Participant</th>
                  {openDays.map((d) => (
                    <th key={d} className="px-1 text-center text-xs font-normal text-muted">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map(({ p }) => (
                  <tr key={p.email} className="border-t border-line">
                    <td className="py-1 pr-4">{p.name}</td>
                    {openDays.map((d) => (
                      <td key={d} className="px-1 text-center">
                        {p.attended.has(d) ? <span className="text-green-600">●</span> : <span className="text-zinc-300 dark:text-zinc-700">○</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* attempts */}
      <section>
        <h2 className="mb-2 text-xl font-bold">Recent attempts ({rows.length})</h2>
        <table className="w-full text-sm">
          <tbody>
            {(showAll ? rows : rows.slice(0, 15)).map((r) => (
              <tr key={r.id} className={`border-b border-line ${fresh.has(r.id) ? "bg-blue-50 dark:bg-blue-950" : ""}`}>
                <td className="py-1 pr-3 text-muted">{new Date(r.created_at).toLocaleString()}</td>
                <td className="pr-3">Day {r.day}</td>
                <td className="pr-3">{r.name}</td>
                <td className="pr-3">{r.score}/{r.total}</td>
                <td className="font-semibold">{r.percent}%</td>
                <td className="pl-3 text-xs text-blue-600">{fresh.has(r.id) ? "new" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 15 && (
          <button className={`${btn} mt-2`} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer" : `Show all ${rows.length}`}
          </button>
        )}
      </section>
    </div>
  );
}
