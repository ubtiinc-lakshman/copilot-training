import type { Sql } from "@/lib/assign";

export const initialsOf = (name: string) =>
  name.split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

// Everything the profile pages need besides loadMine(): the roster entry, best quiz percent per quiz, and days attended.
// Quiz numbers below 200 are the GitHub Copilot course (lessons 1-30, sessions 101-115); other courses get their own ranges.
export async function loadProfile(sql: Sql, email: string) {
  const [roster, quizzes, attended] = await Promise.all([
    sql`SELECT team, github_id FROM roster WHERE email = ${email}`,
    sql`SELECT day, max(percent)::int AS percent FROM results WHERE lower(email) = ${email} AND day < 200 GROUP BY day`,
    sql`SELECT count(*)::int AS n FROM attendance WHERE lower(email) = ${email}`,
  ]);
  const scores = quizzes.map((q) => q.percent as number);
  return {
    team: (roster[0]?.team as string | null) ?? null,
    github: (roster[0]?.github_id as string | null) ?? null,
    onRoster: roster.length > 0,
    quizzesTaken: scores.length,
    quizAverage: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    daysAttended: attended[0].n as number,
  };
}
