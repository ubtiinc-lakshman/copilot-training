import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card space-y-3 p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div>
      {label && <p className="mb-1 font-mono text-xs font-semibold text-muted">{label}</p>}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#0f1220] p-4 font-mono text-sm leading-relaxed text-slate-100">{children}</pre>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 font-semibold text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">{children}</p>;
}
