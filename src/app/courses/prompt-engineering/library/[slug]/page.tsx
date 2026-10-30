import { Suspense } from "react";
import Link from "next/link";
import { DocView } from "@/components/Docs";
import { PageSkeleton } from "@/components/Skeleton";

async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  return <DocView course="prompt-engineering" slug={(await params).slug} base="/courses/prompt-engineering/library" />;
}

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering/library" className="link text-sm">
        Library
      </Link>
      <Suspense fallback={<PageSkeleton />}>
        <Doc params={params} />
      </Suspense>
    </main>
  );
}
