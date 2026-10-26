import { neon } from "@neondatabase/serverless";
import { PROGRAM_TABLES } from "@/lib/schema";

// Neon Postgres over HTTP (DATABASE_URL, set by the Vercel Neon integration).
const sql = neon(process.env.DATABASE_URL ?? "");

let ready: Promise<unknown> | undefined;
// Tables are created on first use, once per server instance.
export function db() {
  ready ??= Promise.all([
    sql`CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      day INTEGER NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent INTEGER NOT NULL,
      answers JSONB NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS attendance (
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      day INTEGER NOT NULL,
      first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (email, day)
    )`,
    ...PROGRAM_TABLES.map((ddl) => sql.query(ddl)),
  ]).catch((e) => {
    ready = undefined;
    throw e;
  });
  return ready.then(() => sql);
}

export type ResultRow = {
  id: number;
  created_at: string;
  day: number;
  email: string;
  name: string;
  score: number;
  total: number;
  percent: number;
};

export type AttendanceRow = { email: string; name: string; day: number };
export type LabRow = { email: string; name: string; day: number; note: string | null; completed_at: string };
