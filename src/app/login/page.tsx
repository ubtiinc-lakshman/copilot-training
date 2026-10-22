import { Suspense } from "react";
import { signIn } from "@/auth";

export const metadata = { title: "Sign in" };

async function SignInForm({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  // Only same-site paths, so the login can't be used as an open redirect.
  const to = from?.startsWith("/") && !from.startsWith("//") ? from : "/";
  return (
    <form
      className="mt-6"
      action={async () => {
        "use server";
        await signIn("microsoft-entra-id", { redirectTo: to });
      }}
    >
      <button className="rounded bg-blue-600 px-4 py-2 text-white">Sign in with Microsoft</button>
    </form>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">GitHub Copilot Training</h1>
      <p className="mt-2 text-sm text-zinc-500">Sign in with your UBTI Microsoft account.</p>
      <Suspense>
        <SignInForm searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
