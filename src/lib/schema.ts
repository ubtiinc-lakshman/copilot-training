// Tables for the weekly app-build program. Plain SQL strings so the same DDL runs on Neon (db.ts) and in the tests.
export const PROGRAM_TABLES: string[] = [
  // One row per completed activity (a lab, a Friday call...). Undo deletes the row.
  `CREATE TABLE IF NOT EXISTS completions (
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    activity TEXT NOT NULL,
    note TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (email, activity)
  )`,
  // Screenshot of the git commit (on the participant's own branch) that proves a session lab was done. Image stored as base64 text.
  `CREATE TABLE IF NOT EXISTS lab_proofs (
    email TEXT NOT NULL,
    activity TEXT NOT NULL,
    mime TEXT NOT NULL,
    data TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (email, activity)
  )`,
  // The pain-point bank. Loaded by scripts/seed-painpoints.mjs from data/painpoints.json (never in the public repo).
  `CREATE TABLE IF NOT EXISTS painpoints (
    id TEXT PRIMARY KEY,
    week INTEGER NOT NULL,
    data JSONB NOT NULL
  )`,
  // One pain point per person per week, and a pain point can only ever be given to one person.
  `CREATE TABLE IF NOT EXISTS assignments (
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    week INTEGER NOT NULL,
    pain_point_id TEXT NOT NULL UNIQUE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (email, week)
  )`,
  `CREATE TABLE IF NOT EXISTS submissions (
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    week INTEGER NOT NULL,
    url TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    copilot TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (email, week)
  )`,
  // The 36 participants. The progress page lists exactly these people; facilitators add and remove rows there.
  `CREATE TABLE IF NOT EXISTS roster (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    team TEXT,
    github_id TEXT,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  // Prompt Engineering course: one lab submission per person per unit ("l1", "l2-qa", "l3"). Resubmitting replaces it.
  `CREATE TABLE IF NOT EXISTS pe_submissions (
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    fields JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending',
    feedback TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    PRIMARY KEY (email, unit)
  )`,
  // Reference documents (playbooks, workbooks, prompt repository, sample projects; audience "facilitator" = runbooks). Loaded by scripts/seed-pe-docs.mjs.
  `CREATE TABLE IF NOT EXISTS pe_docs (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    audience TEXT NOT NULL,
    section TEXT NOT NULL,
    sort INTEGER NOT NULL,
    body TEXT NOT NULL
  )`,
  // Which course a document belongs to ("prompt-engineering" or "copilot"; the table name is from when it held only Prompt Engineering).
  // Which Copilot team track a person is on (chosen by them once, or set by a facilitator). One row per person.
  `CREATE TABLE IF NOT EXISTS gt_enrollment (
    email TEXT PRIMARY KEY,
    track TEXT NOT NULL,
    set_by TEXT NOT NULL,
    set_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE pe_docs ADD COLUMN IF NOT EXISTS course TEXT NOT NULL DEFAULT 'prompt-engineering'`,
];
