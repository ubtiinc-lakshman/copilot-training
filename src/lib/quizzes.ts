import { db } from "@/lib/db";
import type { Question } from "@/lib/grade";

// Quiz questions and answers live in Neon (table `quizzes`), never in the public repo. Load with scripts/seed-quizzes.mjs.
export async function getQuiz(day: number): Promise<Question[] | null> {
  const sql = await db();
  const rows = await sql`SELECT questions FROM quizzes WHERE day = ${day}`;
  return (rows[0]?.questions as Question[] | undefined) ?? null;
}

// What the browser may see: no answers, keywords or correct flags.
export type PublicQuestion = Pick<Question, "q" | "type" | "options"> & { answer?: string };
export const toPublic = (qs: Question[], withAnswers: boolean): PublicQuestion[] =>
  qs.map(({ q, type, options, answer }) => ({ q, type, options, ...(withAnswers ? { answer } : {}) }));
