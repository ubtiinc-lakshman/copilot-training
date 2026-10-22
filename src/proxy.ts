import { auth } from "@/auth";

// Optimistic gate: everything needs a session except the login page and the auth endpoints.
// Route handlers re-check the session themselves.
export const proxy = auth((req) => {
  if (!req.auth) return Response.redirect(new URL(`/login?from=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl.origin));
});

export const config = { matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"] };
