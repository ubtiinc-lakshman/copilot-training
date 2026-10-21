import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div>
      {label && <p className="mb-1 text-xs font-semibold text-zinc-500">{label}</p>}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-zinc-900 p-3 text-sm text-zinc-100">{children}</pre>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <p className="rounded bg-amber-100 px-3 py-2 font-semibold text-amber-900">{children}</p>;
}
