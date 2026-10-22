import Link from "next/link";
import { auth, isFacilitator, signOut } from "@/auth";

// Top bar: who is signed in, facilitator link, sign out. Renders nothing when signed out (login page).
export default async function UserMenu() {
  const user = (await auth())?.user;
  if (!user) return null;
  return (
    <header className="flex flex-wrap items-center justify-end gap-4 border-b border-zinc-200 px-6 py-2 text-sm dark:border-zinc-800">
      {isFacilitator(user.email) && (
        <Link href="/facilitator/results" className="text-blue-600 hover:underline">
          Results
        </Link>
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
