"use client";

import { useEffect, useState } from "react";
import { useFacilitator } from "@/lib/facilitator";
import { gradeQuiz, isCorrect, type Given, type Question } from "@/lib/grade";

export type { Question };

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Quiz({ day, questions, passPercent }: { day: number; questions: Question[]; passPercent?: number }) {
  const facilitator = useFacilitator();
  const [given, setGiven] = useState<Given[]>(() => questions.map(() => undefined));
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [save, setSave] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("participant:name") ?? "");
  }, []);

  const set = (i: number, v: Given) => setGiven((g) => g.map((x, j) => (j === i ? v : x)));
  const { score, total, percent } = gradeQuiz(questions, given);

  const submit = async () => {
    setSubmitted(true);
    if (!name.trim()) {
      setSave("error");
      setMessage("Enter your name above so your result can be saved.");
      return;
    }
    localStorage.setItem("participant:name", name.trim());
    setSave("saving");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ day, name: name.trim(), answers: given.map((g) => g ?? null) }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      setSave("saved");
      setMessage("Result saved.");
    } catch (e) {
      setSave("error");
      setMessage(`Not saved: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">
        Your name (saved with your result)
        <input
          className="mt-1 w-full max-w-sm rounded border border-zinc-300 px-2 py-1 font-normal dark:border-zinc-700 dark:bg-zinc-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. lakshman.s"
        />
      </label>
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
