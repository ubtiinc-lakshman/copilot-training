"use client";

import { useEffect, useState } from "react";
import { useFacilitator } from "@/lib/facilitator";
import type { Given } from "@/lib/grade";
import type { PublicQuestion } from "@/lib/quizzes";

type SaveState = "idle" | "saving" | "saved" | "error";
type Attempt = { created_at: string; score: number; total: number; percent: number };

export default function Quiz({ day, passPercent }: { day: number; passPercent?: number }) {
  const facilitator = useFacilitator();
  // Questions come from the server without answers; grading happens there too.
  const [questions, setQuestions] = useState<PublicQuestion[] | null>(null);
  const [given, setGiven] = useState<Given[]>([]);
  const [outcome, setOutcome] = useState<{ score: number; total: number; percent: number; correct: boolean[] } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [save, setSave] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    // The last attempt's answers and result are restored until the person starts a new attempt.
    const mine = fetch(`/api/results/mine?day=${day}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    fetch(`/api/quiz/${day}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Quiz not available"))))
      .then(async (d) => {
        const m = await mine;
        const last = m?.latest;
        setQuestions(d.questions);
        setAttempts(m?.attempts ?? []);
        if (last) {
          const a = m.attempts[0] as Attempt;
          setGiven(last.answers);
          setOutcome({ score: a.score, total: a.total, percent: a.percent, correct: last.correct });
          setSubmitted(true);
        } else {
          setGiven(d.questions.map(() => undefined));
        }
      })
      .catch((e) => {
        setSave("error");
        setMessage(e.message);
      });
  }, [day]);

  const newAttempt = () => {
    setGiven(questions!.map(() => undefined));
    setOutcome(null);
    setSubmitted(false);
    setSave("idle");
    setMessage("");
  };

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
      setAttempts((a) => [{ created_at: new Date().toISOString(), score: data.score, total: data.total, percent: data.percent }, ...a]);
      setSave("saved");
      setMessage("Result saved.");
    } catch (e) {
      setSave("error");
      setMessage(`Not saved: ${(e as Error).message}`);
    }
  };

  if (!questions) return <p className="text-sm text-muted">{save === "error" ? message : "Loading quiz..."}</p>;
  const { score, total, percent } = outcome ?? { score: 0, total: questions.length, percent: 0 };

  return (
    <div className="space-y-4">
      {attempts.length > 0 && (
        <div className="card p-4 text-sm">
          <p className="font-semibold">Your attempts ({attempts.length})</p>
          <ul className="mt-1 space-y-0.5">
            {attempts.map((a, i) => (
              <li key={a.created_at + i} className={i === 0 ? "font-semibold" : "text-muted"}>
                Attempt {attempts.length - i}: {a.score}/{a.total} ({a.percent}%) - {new Date(a.created_at).toLocaleString()}
                {i === 0 && submitted ? " (shown below)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      {questions.map((q, i) => (
        <div key={q.q} className="card p-5">
          <p className="font-semibold">
            {i + 1}. {q.q}
          </p>
          {q.type === "mcq" &&
            q.options?.map((o, oi) => (
              <label key={o} className="mt-1 block text-sm">
                <input type="radio" name={`q${i}`} className="mr-2" checked={given[i] === oi} disabled={submitted} onChange={() => set(i, oi)} />
                {o}
              </label>
            ))}
          {q.type === "tf" && (
            <div className="mt-1 flex gap-4 text-sm">
              {[true, false].map((v) => (
                <label key={String(v)}>
                  <input type="radio" name={`q${i}`} className="mr-2" checked={given[i] === v} disabled={submitted} onChange={() => set(i, v)} />
                  {v ? "True" : "False"}
                </label>
              ))}
            </div>
          )}
          {q.type === "short" && (
            <input
              className="input mt-2"
              disabled={submitted}
              value={String(given[i] ?? "")}
              onChange={(e) => set(i, e.target.value)}
            />
          )}
          {submitted && (
            <p className={`mt-2 text-sm font-semibold ${outcome?.correct[i] ? "text-emerald-600" : "text-rose-600"}`}>
              {outcome?.correct[i] ? "Correct" : "Not correct"}
            </p>
          )}
          {facilitator && q.answer && <p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-950">Answer: {q.answer}</p>}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        {submitted ? (
          <button className="btn-ghost" onClick={newAttempt}>
            Start a new attempt
          </button>
        ) : (
          <button className="btn-primary" onClick={submit} disabled={save === "saving"}>
            Check answers
          </button>
        )}
        {submitted && (
          <span className="font-semibold">
            Score: {score}/{total} ({percent}%)
            {passPercent !== undefined && (percent >= passPercent ? " - PASS" : ` - below the ${passPercent}% pass mark`)}
          </span>
        )}
        {save !== "idle" && <span className={`text-sm ${save === "error" ? "text-rose-600" : "text-muted"}`}>{save === "saving" ? "Saving..." : message}</span>}
      </div>
    </div>
  );
}
