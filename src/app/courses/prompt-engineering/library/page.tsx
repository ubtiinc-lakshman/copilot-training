import { Suspense } from "react";
import Link from "next/link";
import { DocList } from "@/components/Docs";
import { PageSkeleton } from "@/components/Skeleton";

export const metadata = { title: "Library | Prompt Engineering" };

export default function LibraryPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering" className="link text-sm">
        Prompt Engineering
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Library</h1>
      <p className="text-muted">Team playbooks, lab workbooks, the prompt repository, reference sheets and sample projects you can create in minutes.</p>
      <Suspense fallback={<PageSkeleton />}>
        <DocList course="prompt-engineering" base="/courses/prompt-engineering/library" />
      </Suspense>
    </main>
  );
}
