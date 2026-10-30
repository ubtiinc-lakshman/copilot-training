"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "scenario", label: "Your scenario (2 to 4 sentences, anonymised)", only: "l3" },
  { key: "initial", label: "Initial prompt (your first attempt)" },
  { key: "refined", label: "Refined prompt (after reviewing the output)" },
  { key: "output", label: "Output summary (3 to 5 bullets)" },
  { key: "validation", label: "Validation notes (what you would check, assumptions, risks)" },
] as const;

// The lab submission for one Prompt Engineering unit. Resubmitting replaces the earlier one.
export default function PeLabForm({ unit, initial }: { unit: string; initial: Record<string, string> | null }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initial ?? {});
  const [state, setState] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text?: string }>({ kind: "idle" });

  const submit = async () => {
    setState({ kind: "saving" });
    const res = await fetch("/api/pe/submission", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ unit, ...values }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ kind: "error", text: data.error ?? "Could not save" });
    setState({ kind: "ok", text: "Submitted." });
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {FIELDS.filter((f) => !("only" in f) || f.only === unit).map((f) => (
        <label key={f.key} className="block text-sm font-semibold">
          {f.label}
          <textarea className="input mt-1 min-h-24 font-normal" value={values[f.key] ?? ""} maxLength={6000} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
        </label>
      ))}
      <p className="text-xs text-muted">Do not paste secrets, customer data or confidential material.</p>
      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={submit} disabled={state.kind === "saving"} aria-busy={state.kind === "saving"}>
          {initial ? "Resubmit lab" : "Submit lab"}
        </button>
        {state.text && <span className={`text-sm ${state.kind === "error" ? "text-rose-600" : "text-muted"}`}>{state.text}</span>}
      </div>
    </div>
  );
}
