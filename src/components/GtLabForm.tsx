"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "did", label: "What you built or fixed (and where: repo, branch, files)" },
  { key: "prompts", label: "The key prompts or Copilot features you used" },
  { key: "validation", label: "How you checked the result, and what you had to change by hand" },
] as const;

// Lab for one Copilot track session: a screenshot of the git commit (branch named after the session) plus three short answers.
export default function GtLabForm({ unit, initial, hasProof }: { unit: string; initial: Record<string, string> | null; hasProof: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initial ?? {});
  const [file, setFile] = useState<File | null>(null);
  const [proof, setProof] = useState(hasProof);
  const [state, setState] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text?: string }>({ kind: "idle" });

  const submit = async () => {
    setState({ kind: "saving" });
    if (file) {
      const form = new FormData();
      form.set("id", unit);
      form.set("file", file);
      const up = await fetch("/api/proof", { method: "POST", body: form });
      const upData = await up.json().catch(() => ({}));
      if (!up.ok) return setState({ kind: "error", text: upData.error ?? "Screenshot upload failed" });
      setProof(true);
    }
    const res = await fetch("/api/gt/submission", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ unit, ...values }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ kind: "error", text: data.error ?? "Could not save" });
    setState({ kind: "ok", text: "Submitted." });
    setFile(null);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        Screenshot of your git commit (PNG, JPG or WebP, max 3 MB) {proof && <span className="chip-done ml-2">Uploaded</span>}
        <input className="input mt-1 font-normal" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <span className="mt-1 block text-xs font-normal text-muted">
          Commit on a branch named <code>{unit}</code>, not main. {proof ? "Choose a file only if you want to replace the screenshot." : "Required."}
        </span>
      </label>
      {FIELDS.map((f) => (
        <label key={f.key} className="block text-sm font-semibold">
          {f.label}
          <textarea className="input mt-1 min-h-24 font-normal" value={values[f.key] ?? ""} maxLength={6000} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
        </label>
      ))}
      <p className="text-xs text-muted">Use sanitised or invented data. Do not paste secrets, customer data or confidential material.</p>
      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={submit} disabled={state.kind === "saving"}>
          {initial ? "Resubmit lab" : "Submit lab"}
        </button>
        {state.text && <span className={`text-sm ${state.kind === "error" ? "text-rose-600" : "text-muted"}`}>{state.text}</span>}
      </div>
    </div>
  );
}
