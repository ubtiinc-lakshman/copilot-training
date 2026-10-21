"use client";

import { useState } from "react";
import { useFacilitator } from "@/lib/facilitator";

export type Question = {
  q: string;
  type: "mcq" | "tf" | "short";
  options?: string[];
  correct?: number | boolean; // mcq: option index, tf: true/false
  keywords?: string[]; // short: any keyword (case-insensitive) counts as correct
  answer: string; // shown in facilitator mode
};

type Given = string | number | boolean | undefined;

function isCorrect(q: Question, given: Given): boolean {
  if (given === undefined || given === "") return false;
  if (q.type === "short") return (q.keywords ?? []).some((k) => String(given).toLowerCase().includes(k.toLowerCase()));
  return given === q.correct;
}

export default function Quiz({ questions, passPercent }: { questions: Question[]; passPercent?: number }) {
  const facilitator = useFacilitator();
  const [given, setGiven] = useState<Given[]>(() => questions.map(() => undefined));
  const [submitted, setSubmitted] = useState(false);

  const set = (i: number, v: Given) => setGiven((g) => g.map((x, j) => (j === i ? v : x)));
  const score = questions.filter((q, i) => isCorrect(q, given[i])).length;
  const percent = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={q.q} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="font-semibold">
            {i + 1}. {q.q}
          </p>
          {q.type === "mcq" &&
            q.options?.map((o, oi) => (
              <label key={o} className="mt-1 block text-sm">
                <input type="radio" name={`q${i}`} className="mr-2" checked={given[i] === oi} onChange={() => set(i, oi)} />
                {o}
              </label>
            ))}
          {q.type === "tf" && (
            <div className="mt-1 flex gap-4 text-sm">
              {[true, false].map((v) => (
                <label key={String(v)}>
                  <input type="radio" name={`q${i}`} className="mr-2" checked={given[i] === v} onChange={() => set(i, v)} />
                  {v ? "True" : "False"}
                </label>
              ))}
            </div>
          )}
          {q.type === "short" && (
            <input
              className="mt-2 w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              value={String(given[i] ?? "")}
              onChange={(e) => set(i, e.target.value)}
            />
          )}
          {submitted && (
            <p className={`mt-2 text-sm font-semibold ${isCorrect(q, given[i]) ? "text-green-600" : "text-red-600"}`}>
              {isCorrect(q, given[i]) ? "Correct" : "Not correct"}
            </p>
          )}
          {facilitator && <p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-950">Answer: {q.answer}</p>}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setSubmitted(true)}>
          Check answers
        </button>
        {submitted && (
          <span className="font-semibold">
            Score: {score}/{questions.length} ({percent}%)
            {passPercent !== undefined && (percent >= passPercent ? " - PASS" : ` - below the ${passPercent}% pass mark`)}
          </span>
        )}
      </div>
    </div>
  );
}
