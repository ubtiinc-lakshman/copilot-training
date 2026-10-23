"use client";

import { useState } from "react";

const DIMENSIONS = [
  ["Prompt & Context Quality", "Context-Task-Requirements-Additional Info used consistently; specific, not generic"],
  ["Output Judgment", "Caught what Copilot missed, unprompted, and corrected it"],
  ["Code / Test Quality", "Dev: correct, edge cases handled. QA: negative and boundary coverage, stable tests"],
  ["Security & Governance", "No governance issues; usage notes complete; security checklist applied"],
  ["Validation & Collaboration", "Pair cross-checked each other's work; both explained the OTHER half"],
] as const;

function band(total: number) {
  if (total >= 20) return "Certified";
  if (total >= 15) return "Competent";
  if (total >= 10) return "Developing";
  return "Not Yet Competent";
}

export function RubricScorer() {
  const [scores, setScores] = useState<number[]>(DIMENSIONS.map(() => 3));
  const total = scores.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      {DIMENSIONS.map(([name, hint], i) => (
        <div key={name} className="flex items-center justify-between gap-4 text-sm">
          <span>
            <b>{name}</b>
            <span className="block text-xs text-zinc-500">{hint}</span>
          </span>
          <select
            className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={scores[i]}
            onChange={(e) => setScores(scores.map((s, j) => (j === i ? Number(e.target.value) : s)))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      ))}
      <p className="pt-2 font-semibold">
        Total {total}/25: {band(total)}
      </p>
    </div>
  );
}

export function LevelGate() {
  const [attendance, setAttendance] = useState(90);
  const [average, setAverage] = useState(75);
  const pass = attendance >= 80 && average >= 70;
  const input = "w-20 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900";
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
      <label className="block">
        Attendance across the level (%) <input className={input} type="number" value={attendance} onChange={(e) => setAttendance(Number(e.target.value))} />
      </label>
      <label className="block">
        Average assessment score (%) <input className={input} type="number" value={average} onChange={(e) => setAverage(Number(e.target.value))} />
      </label>
      <p className={`font-semibold ${pass ? "text-green-600" : "text-red-600"}`}>
        {pass ? "Level gate: PASS" : "Level gate: not met (needs 80% attendance and 70% average)"}
      </p>
    </div>
  );
}
