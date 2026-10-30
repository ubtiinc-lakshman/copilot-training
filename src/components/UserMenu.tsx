import Link from "next/link";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { auth, isFacilitator, signOut } from "@/auth";
import { isParticipantView } from "@/lib/viewMode";
import { initialsOf } from "@/lib/profile";
import { AccountMenu, NavLinks, type NavItem } from "@/components/HeaderClient";

const item = "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-brand-soft hover:text-brand";

// Top bar: brand, navigation with the current page highlighted, account menu. Renders nothing when signed out (login page).
export default async function UserMenu() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  const user = (await auth())?.user;
  if (!user) return null;
  const facilitator = isFacilitator(user.email);
  const participantView = facilitator && (await isParticipantView());
  const items: NavItem[] = [
    { href: "/", label: "Courses" },
    { href: "/courses/copilot", label: "GitHub Copilot" },
    { href: "/courses/prompt-engineering", label: "Prompt Engineering" },
  ];
  const name = user.name ?? user.email ?? "";
  return (
    <header className="site-header sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-6 py-2">
        <Link href="/" className="mr-3 flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-xs text-white" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
            AI
          </span>
          <span className="hidden sm:inline">IC Training Center</span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          <NavLinks items={items} />
        </nav>
        {participantView && <span className="chip-today hidden shrink-0 md:inline-flex">Participant view</span>}
        <AccountMenu initials={initialsOf(name)}>
          <div className="px-3 pb-2 pt-1">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <span className={`${facilitator && !participantView ? "chip-brand" : "chip-idle"} mt-2`}>{facilitator && !participantView ? "Facilitator" : "Participant"}</span>
          </div>
          <div className="border-t border-line pt-1">
            <Link href="/profile" className={item}>My profile</Link>
            {facilitator && (
              <form
                action={async () => {
                  "use server";
                  const jar = await cookies();
                  if (await isParticipantView()) jar.delete("view-as");
                  else jar.set("view-as", "participant", { path: "/", httpOnly: true, sameSite: "lax" });
                }}
              >
                <button className={item}>{participantView ? "Switch back to facilitator view" : "View as participant"}</button>
              </form>
            )}
          </div>
          <form
            className="border-t border-line pt-1"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className={item}>Sign out</button>
          </form>
        </AccountMenu>
      </div>
    </header>
  );
}
