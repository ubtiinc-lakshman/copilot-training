import { Suspense } from "react";
import Link from "next/link";
import { DocView } from "@/components/Docs";

async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  return <DocView course="prompt-engineering" slug={(await params).slug} />;
}

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/prompt-engineering/library" className="link text-sm">
        Library
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Doc params={params} />
      </Suspense>
    </main>
  );
}
