import { PageSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <PageSkeleton />
    </main>
  );
}
