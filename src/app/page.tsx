import Link from "next/link";
import { COURSES } from "@/courses";

export default function CatalogPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="chip-brand">IC Training Center</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
        Learn at your{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          own pace
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted">Self-paced courses from the Innovation Center. Each one has content, labs, tasks, quizzes and an assessment.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {COURSES.map((c) => (
          <Link key={c.id} href={c.href} className="card-link flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold">{c.title}</p>
              <span className={c.status === "live" ? "chip-done" : "chip-idle"}>{c.status === "live" ? "Open" : "Coming soon"}</span>
            </div>
            <p className="text-sm text-muted">{c.blurb}</p>
            <p className="mt-auto text-xs text-muted">{c.parts.join(" | ")}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
