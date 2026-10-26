import { auth } from "@/auth";

// The signed-in participant (email lower-cased), or null.
export async function currentUser() {
  const u = (await auth())?.user;
  return u?.email ? { email: u.email.toLowerCase(), name: u.name ?? u.email } : null;
}
