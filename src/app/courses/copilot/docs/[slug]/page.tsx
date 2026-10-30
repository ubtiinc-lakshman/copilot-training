import { Suspense } from "react";
import Link from "next/link";
import { DocView } from "@/components/Docs";
import { PageSkeleton } from "@/components/Skeleton";

async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  return <DocView course="copilot" slug={(await params).slug} base="/courses/copilot/docs" />;
}

export default function CopilotDocPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot/docs" className="link text-sm">
        Documents
      </Link>
      <Suspense fallback={<PageSkeleton />}>
        <Doc params={params} />
      </Suspense>
    </main>
  );
}
