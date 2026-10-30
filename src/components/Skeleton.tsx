// Loading placeholders with a shimmer. Used as the Suspense fallback of every page and while client components fetch.
const bar = (w: string, h = "h-4") => <div className={`skeleton ${h} ${w}`} />;

// A page-like placeholder: a heading line, a short paragraph and a few cards.
export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="mt-6 space-y-4" role="status" aria-label="Loading">
      {bar("w-1/3", "h-7")}
      {bar("w-2/3")}
      <div className="grid gap-4 pt-2 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="card space-y-3 p-5">
            {bar("w-24", "h-5")}
            {bar("w-3/4", "h-5")}
            {bar("w-full")}
            {bar("w-5/6")}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Placeholder for a few lines of text or a form.
export function LinesSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{bar(i % 3 === 2 ? "w-2/3" : "w-full")}</div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
