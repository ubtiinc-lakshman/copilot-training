import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { SideNavLinks, type NavItem } from "@/components/HeaderClient";
import ScrollChrome from "@/components/ScrollChrome";

type Group = { label?: string; items: NavItem[] };

// Facilitator links only show for a real facilitator who is not in participant view.
async function Links({ groups, facilitatorGroup }: { groups: Group[]; facilitatorGroup: Group }) {
  await connection(); // auth() uses random bytes, so render per request, not at build
  const facilitator = await actingFacilitator((await auth())?.user?.email);
  return <SideNavLinks groups={facilitator ? [...groups, facilitatorGroup] : groups} />;
}

// Left-hand course menu shared by every course. On narrow screens it becomes a strip above the page.
export default function CourseShell({ title, groups, facilitatorGroup, children }: { title: string; groups: Group[]; facilitatorGroup: Group; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col lg:flex-row">
      <ScrollChrome />
      <aside className="course-side shrink-0 border-b border-line px-6 py-2 lg:sticky lg:top-[65px] lg:h-fit lg:w-56 lg:border-b-0 lg:py-10 lg:pr-0" aria-label={`${title} course`}>
        <p className="mb-1 hidden px-3 text-sm font-bold lg:block">{title}</p>
        <Suspense>
          <Links groups={groups} facilitatorGroup={facilitatorGroup} />
        </Suspense>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
