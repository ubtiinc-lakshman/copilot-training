"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Facilitator: pass `email` to assign or change someone else. Participant: picks their own track once, after a confirmation.
export default function EnrollButton({ track, label, email, confirmText }: { track: string; label: string; email?: string; confirmText?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/gt/enroll", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ track, email }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save");
    router.refresh();
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button className={email ? "btn-ghost" : "btn-primary"} disabled={busy} aria-busy={busy} onClick={go}>
        {label}
      </button>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </span>
  );
}
