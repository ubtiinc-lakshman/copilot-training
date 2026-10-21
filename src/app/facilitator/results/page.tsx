import Link from "next/link";
import ResultsView from "./ResultsView";

export const metadata = { title: "Quiz results (facilitator)" };

export default function ResultsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        All days
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Quiz results</h1>
      <ResultsView />
    </main>
  );
}
