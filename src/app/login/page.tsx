import { Suspense } from "react";
import { signIn } from "@/auth";

export const metadata = { title: "Sign in" };

async function SignInForm({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  // Only same-site paths, so the login can't be used as an open redirect.
  const to = from?.startsWith("/") && !from.startsWith("//") ? from : "/";
  return (
    <form
      className="mt-8"
      action={async () => {
        "use server";
        await signIn("microsoft-entra-id", { redirectTo: to });
      }}
    >
      <button className="btn-primary w-full !py-3 text-base">Sign in with Microsoft</button>
    </form>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  return (
    <main className="grid flex-1 place-items-center px-6 py-20">
      <div className="card w-full max-w-sm p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-white" style={{ backgroundImage: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          AI
        </span>
        <h1 className="mt-5 text-2xl font-bold">IC Training Center</h1>
        <p className="mt-2 text-sm text-muted">Build a real app every week. Sign in with your UBTI Microsoft account.</p>
        <Suspense>
          <SignInForm searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
