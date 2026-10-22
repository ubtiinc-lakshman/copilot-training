"use client";

import { useEffect, useState } from "react";
import { useFacilitator } from "@/lib/facilitator";
import type { Given } from "@/lib/grade";
import type { PublicQuestion } from "@/lib/quizzes";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Quiz({ day, passPercent }: { day: number; passPercent?: number }) {
  const facilitator = useFacilitator();
  // Questions come from the server without answers; grading happens there too.
  const [questions, setQuestions] = useState<PublicQuestion[] | null>(null);
  const [given, setGiven] = useState<Given[]>([]);
  const [outcome, setOutcome] = useState<{ score: number; total: number; percent: number; correct: boolean[] } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/quiz/${day}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Quiz not available"))))
      .then((d) => {
        setQuestions(d.questions);
        setGiven(d.questions.map(() => undefined));
      })
      .catch((e) => {
        setSave("error");
        setMessage(e.message);
      });
  }, [day]);

  const set = (i: number, v: Given) => setGiven((g) => g.map((x, j) => (j === i ? v : x)));

  const submit = async () => {
    setSave("saving");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ day, answers: given.map((g) => g ?? null) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setOutcome(data);
      setSubmitted(true);
      setSave("saved");
      setMessage("Result saved.");
    } catch (e) {
      setSave("error");
      setMessage(`Not saved: ${(e as Error).message}`);
    }
  };

  if (!questions) return <p className="text-sm text-zinc-500">{save === "error" ? message : "Loading quiz..."}</p>;
  const { score, total, percent } = outcome ?? { score: 0, total: questions.length, percent: 0 };

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
            <p className={`mt-2 text-sm font-semibold ${outcome?.correct[i] ? "text-green-600" : "text-red-600"}`}>
              {outcome?.correct[i] ? "Correct" : "Not correct"}
            </p>
          )}
          {facilitator && q.answer && <p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-950">Answer: {q.answer}</p>}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50" onClick={submit} disabled={save === "saving"}>
          Check answers
        </button>
        {submitted && (
          <span className="font-semibold">
            Score: {score}/{total} ({percent}%)
            {passPercent !== undefined && (percent >= passPercent ? " - PASS" : ` - below the ${passPercent}% pass mark`)}
          </span>
        )}
        {save !== "idle" && <span className={`text-sm ${save === "error" ? "text-red-600" : "text-zinc-500"}`}>{save === "saving" ? "Saving..." : message}</span>}
      </div>
    </div>
  );
}
