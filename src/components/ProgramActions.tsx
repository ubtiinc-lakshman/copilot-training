"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PainPoint } from "@/lib/assign";

const field = "input mt-1 font-normal";

async function post(url: string, body?: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  return data;
}

// The action that says "I completed this lab / call". Optional note: what you built or what blocked you.
export function LabDone({ id, label, initialDone, initialNote }: { id: string; label: string; initialDone: boolean; initialNote: string }) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [note, setNote] = useState(initialNote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const act = async (nextDone: boolean) => {
    setBusy(true);
    setError("");
    try {
      await post("/api/activity", { id, done: nextDone, note });
      setDone(nextDone);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {!done && (
        <input className={field} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional: what you built, or what blocked you" />
      )}
      {done ? (
        <p className="flex flex-wrap items-center gap-3 text-sm">
          <span className="chip-done">Completed</span>
          {note && <span className="text-muted">{note}</span>}
          <button className="text-xs text-muted underline" onClick={() => act(false)} disabled={busy}>
            Undo
          </button>
        </p>
      ) : (
        <button className="btn-success" onClick={() => act(true)} disabled={busy}>
          {label}
        </button>
      )}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export function PainPointView({ p }: { p: PainPoint }) {
  return (
    <div className="card space-y-2 border-brand/40 bg-brand-soft p-5">
      <p className="chip-brand !bg-surface">{p.audience === "org" ? "Inside an organisation" : "Common person"} | {p.category}</p>
      <h3 className="text-lg font-bold">{p.title}</h3>
      <p>{p.problem}</p>
      <p className="text-sm font-semibold">Your app must:</p>
      <ul className="ml-5 list-disc text-sm">
        {p.mustHave.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

// Random assignment: one click, one pain point, never shared and never repeated.
export function PainPointCard({ initial, open, opensOn }: { initial: PainPoint | null; open: boolean; opensOn: string }) {
  const [p, setP] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (p) return <PainPointView p={p} />;
  if (!open) return <p className="text-sm text-muted">Your pain point opens on {opensOn}.</p>;
  return (
    <div className="space-y-2">
      <button
        className="btn-primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            setP((await post("/api/painpoint")).painPoint);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        Give me my pain point
      </button>
      <p className="text-xs text-muted">Picked at random. No one else gets the same one, and you will never get the same one twice.</p>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export type SubmissionData = { url: string; challenge: string; solution: string; copilot: string };

export function SubmissionForm({ week, initial, due }: { week: number; initial: SubmissionData | null; due: string }) {
  const router = useRouter();
  const [f, setF] = useState<SubmissionData>(initial ?? { url: "", challenge: "", solution: "", copilot: "" });
  const [state, setState] = useState<{ kind: "idle" | "saved" | "error"; text: string }>({ kind: initial ? "saved" : "idle", text: initial ? "Submitted. You can update it until the review." : "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof SubmissionData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        Vercel URL of your deployed app
        <input className={field} value={f.url} onChange={set("url")} placeholder="https://my-app.vercel.app" />
      </label>
      <label className="block text-sm font-semibold">
        Biggest challenge you faced
        <textarea className={field} rows={2} value={f.challenge} onChange={set("challenge")} />
      </label>
      <label className="block text-sm font-semibold">
        How you solved it
        <textarea className={field} rows={2} value={f.solution} onChange={set("solution")} />
      </label>
      <label className="block text-sm font-semibold">
        How you used Copilot (prompts, agent, instructions...)
        <textarea className={field} rows={2} value={f.copilot} onChange={set("copilot")} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await post("/api/submission", { week, ...f });
              setState({ kind: "saved", text: r.late ? `Submitted (after the ${due} deadline).` : "Submitted." });
              router.refresh();
            } catch (e) {
              setState({ kind: "error", text: (e as Error).message });
            } finally {
              setBusy(false);
            }
          }}
        >
          {initial ? "Update submission" : "Submit app"}
        </button>
        {state.kind !== "idle" && <span className={`text-sm ${state.kind === "error" ? "text-rose-600" : "text-emerald-700"}`}>{state.text}</span>}
      </div>
    </div>
  );
}
