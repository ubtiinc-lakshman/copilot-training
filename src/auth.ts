import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Microsoft work-account sign-in, limited to one tenant (AUTH_MICROSOFT_ENTRA_ID_TENANT_ID).
// JWT sessions: no session table. Env: AUTH_SECRET, AUTH_MICROSOFT_ENTRA_ID_{ID,SECRET,TENANT_ID}.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
  ],
  pages: { signIn: "/login" },
});

export const isFacilitator = (email?: string | null) =>
  !!email && (process.env.FACILITATOR_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).includes(email.toLowerCase());
