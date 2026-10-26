import Link from "next/link";
import { cookies } from "next/headers";
import { auth, isFacilitator, signOut } from "@/auth";
import { isParticipantView } from "@/lib/viewMode";

// Top bar: who is signed in, facilitator link, sign out. Renders nothing when signed out (login page).
export default async function UserMenu() {
  const user = (await auth())?.user;
  if (!user) return null;
  const participantView = isFacilitator(user.email) && (await isParticipantView());
  return (
    <header className="flex flex-wrap items-center justify-end gap-4 border-b border-zinc-200 px-6 py-2 text-sm dark:border-zinc-800">
      <Link href="/today" className="font-semibold text-blue-600 hover:underline">
        My week
      </Link>
      {isFacilitator(user.email) && (
        <Link href="/facilitator/progress" className="text-blue-600 hover:underline">
          Progress
        </Link>
      )}
      {isFacilitator(user.email) && (
        <Link href="/facilitator/results" className="text-blue-600 hover:underline">
          Results
        </Link>
      )}
      {isFacilitator(user.email) && (
        <form
          action={async () => {
            "use server";
            const jar = await cookies();
            if (await isParticipantView()) jar.delete("view-as");
            else jar.set("view-as", "participant", { path: "/", httpOnly: true, sameSite: "lax" });
          }}
        >
          <button className={`rounded border px-3 py-1 ${participantView ? "border-amber-500 bg-amber-100 text-amber-900" : "border-zinc-400"}`}>
            {participantView ? "Viewing as participant - switch back" : "View as participant"}
          </button>
        </form>
      )}
      <span title={user.email ?? ""}>
        <b>{user.name}</b> <span className="text-zinc-500">{user.email}</span>
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded border border-zinc-400 px-3 py-1">Sign out</button>
      </form>
    </header>
  );
}
