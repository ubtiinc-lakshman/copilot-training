"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Facilitator: assign or change the team track of one person.
export default function EnrollSelect({ email, current, tracks }: { email: string; current: string | null; tracks: { id: string; name: string }[] }) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/gt/enroll", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, track: value }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save");
    router.refresh();
  };

  return (
    <span className="inline-flex items-center gap-2">
      <select className="input !w-auto py-1" value={value} onChange={(e) => setValue(e.target.value)} aria-label={`Track for ${email}`}>
        <option value="">Not on a track</option>
        {tracks.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button className="btn-ghost !py-1" disabled={busy || !value || value === current} aria-busy={busy} onClick={save}>Save</button>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </span>
  );
}
