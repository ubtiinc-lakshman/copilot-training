"use client";

import { useState } from "react";
import type { ResultRow } from "@/lib/db";

const PASS = 70;

export default function ResultsView() {
  const [key, setKey] = useState("");
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    const res = await fetch("/api/results", { headers: { "x-facilitator-key": key } });
    const data = await res.json();
    if (!res.ok) {
      setRows(null);
      setError(data.error ?? "Failed to load");
      return;
    }
    setRows(data.rows);
  };

  // Best attempt per participant per day, then the average across the days they attempted.
  const people = new Map<string, Map<number, number>>();
  for (const r of rows ?? []) {
    const who = r.name.toLowerCase();
    const days = people.get(who) ?? new Map<number, number>();
    days.set(r.day, Math.max(days.get(r.day) ?? 0, r.percent));
    people.set(who, days);
  }
  const quizDays = [...new Set((rows ?? []).map((r) => r.day))].sort((a, b) => a - b);
  const display = (who: string) => rows!.find((r) => r.name.toLowerCase() === who)!.name;

  const csv = () => {
    const lines = ["id,time,day,name,score,total,percent", ...rows!.map((r) => [r.id, r.created_at, r.day, `"${r.name.replace(/"/g, '""')}"`, r.score, r.total, r.percent].join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = "quiz-results.csv";
    a.click();
  };

  const input = "rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900";
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <input className={input} type="password" placeholder="Facilitator key" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white" onClick={load}>
          {rows ? "Refresh" : "View results"}
        </button>
        {rows && (
          <button className="rounded border border-zinc-400 px-3 py-1 text-sm" onClick={csv}>
            Export CSV
          </button>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {rows && rows.length === 0 && <p className="text-zinc-500">No results yet.</p>}

      {rows && rows.length > 0 && (
        <>
          <section>
            <h2 className="mb-2 text-xl font-semibold">Best score per participant (%)</h2>
            <p className="mb-2 text-xs text-zinc-500">Average = mean of best scores over the quiz days attempted. Level gate: 70% average (plus 80% attendance, tracked separately). Day 9 is the hard gate at {PASS}%.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-300 text-left dark:border-zinc-700">
                    <th className="py-1 pr-4">Participant</th>
                    {quizDays.map((d) => (
                      <th key={d} className="pr-3">Day {d}</th>
                    ))}
                    <th className="pr-3">Average</th>
                    <th>Gate</th>
                  </tr>
                </thead>
                <tbody>
                  {[...people.entries()].map(([who, days]) => {
                    const vals = [...days.values()];
                    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                    const day9 = days.get(9);
                    return (
                      <tr key={who} className="border-b border-zinc-200 dark:border-zinc-800">
                        <td className="py-1 pr-4 font-semibold">{display(who)}</td>
                        {quizDays.map((d) => {
                          const v = days.get(d);
                          return (
                            <td key={d} className={`pr-3 ${d === 9 && v !== undefined && v < PASS ? "font-semibold text-red-600" : ""}`}>
                              {v ?? "-"}
                            </td>
                          );
                        })}
                        <td className="pr-3 font-semibold">{avg}</td>
                        <td className={avg >= PASS && (day9 === undefined || day9 >= PASS) ? "text-green-600" : "text-red-600"}>
                          {day9 === undefined ? (avg >= PASS ? "on track" : "below 70") : day9 < PASS ? "Day 9 below 70" : avg >= PASS ? "on track" : "below 70"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">All attempts ({rows.length})</h2>
            <table className="w-full text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-200 dark:border-zinc-800">
                    <td className="py-1 pr-3 text-zinc-500">{r.created_at}</td>
                    <td className="pr-3">Day {r.day}</td>
                    <td className="pr-3">{r.name}</td>
                    <td className="pr-3">{r.score}/{r.total}</td>
                    <td className="font-semibold">{r.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
