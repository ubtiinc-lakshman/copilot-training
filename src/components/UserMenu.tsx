import Link from "next/link";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { auth, isFacilitator, signOut } from "@/auth";
import { isParticipantView } from "@/lib/viewMode";

const nav = "rounded-lg px-3 py-1.5 text-muted transition hover:bg-brand-soft hover:text-brand";

// Top bar: brand, navigation, who is signed in, sign out. Renders nothing when signed out (login page).
export default async function UserMenu() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  const user = (await auth())?.user;
  if (!user) return null;
  const facilitator = isFacilitator(user.email);
  const participantView = facilitator && (await isParticipantView());
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-1 px-6 py-2 text-sm">
        <Link href="/" className="mr-3 flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-lg text-xs text-white" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
            AI
          </span>
          Copilot Training
        </Link>
        <Link href="/" className={nav}>Home</Link>
        <Link href="/today" className={nav}>My week</Link>
        <Link href="/library" className={nav}>Library</Link>
        {facilitator && <Link href="/facilitator/progress" className={nav}>Progress</Link>}
        {facilitator && <Link href="/facilitator/results" className={nav}>Results</Link>}

        <div className="ml-auto flex items-center gap-3">
          {facilitator && (
            <form
              action={async () => {
                "use server";
                const jar = await cookies();
                if (await isParticipantView()) jar.delete("view-as");
                else jar.set("view-as", "participant", { path: "/", httpOnly: true, sameSite: "lax" });
              }}
            >
              <button className={`btn-ghost !px-3 !py-1 ${participantView ? "!border-amber-500 !bg-amber-100 !text-amber-900" : ""}`}>
                {participantView ? "Viewing as participant - switch back" : "View as participant"}
              </button>
            </form>
          )}
          <span className="hidden text-muted sm:inline" title={user.email ?? ""}>
            <b className="text-foreground">{user.name}</b>
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="btn-ghost !px-3 !py-1">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  );
}
