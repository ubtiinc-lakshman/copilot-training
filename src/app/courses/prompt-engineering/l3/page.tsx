import { Suspense } from "react";
import Link from "next/link";
import PeUnit from "@/components/PeUnit";
import { ASSESSMENT } from "@/program/pe";

export const metadata = { title: "Level 3 | Prompt Engineering" };

export default function Level3Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/courses/prompt-engineering" className="link text-sm">
        Prompt Engineering
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <PeUnit unit={ASSESSMENT} />
      </Suspense>
    </main>
  );
}
