// Runs the real assignment SQL and schema against an in-memory Postgres (PGlite), not Neon.
// npm run test:site
import { test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { assignPainPoint, getAssignment } from "./assign.ts";
import { PROGRAM_TABLES } from "./schema.ts";

async function setup(perWeek = { 1: 40, 2: 3 }) {
  const pg = new PGlite();
  for (const ddl of PROGRAM_TABLES) await pg.exec(ddl);
  const sql = async (strings, ...values) => {
    let q = strings[0];
    values.forEach((_, i) => (q += `$${i + 1}${strings[i + 1]}`));
    return (await pg.query(q, values)).rows;
  };
  for (const [week, n] of Object.entries(perWeek)) {
    for (let i = 1; i <= n; i++) {
      const data = { title: `W${week} problem ${i}`, problem: "p", mustHave: ["a", "b", "c"], category: "c", audience: "common" };
      await pg.query("INSERT INTO painpoints (id, week, data) VALUES ($1, $2, $3::jsonb)", [`w${week}-${i}`, Number(week), JSON.stringify(data)]);
    }
  }
  return { pg, sql };
}

test("36 people in week 1 each get a different pain point", async () => {
  const { sql } = await setup();
  const results = await Promise.all(Array.from({ length: 36 }, (_, i) => assignPainPoint(sql, `p${i}@x.com`, `P${i}`, 1)));
  assert.ok(results.every((r) => r.status === "assigned"));
  assert.equal(new Set(results.map((r) => r.painPoint.id)).size, 36);
});

test("a second click returns the same pain point", async () => {
  const { sql } = await setup();
  const a = await assignPainPoint(sql, "a@x.com", "A", 1);
  const b = await assignPainPoint(sql, "a@x.com", "A", 1);
  assert.equal(a.painPoint.id, b.painPoint.id);
  assert.equal((await getAssignment(sql, "a@x.com", 1)).id, a.painPoint.id);
});

test("only pain points of the requested week are used", async () => {
  const { sql } = await setup();
  const r = await assignPainPoint(sql, "a@x.com", "A", 2);
  assert.match(r.painPoint.id, /^w2-/);
});

test("nobody repeats a pain point across weeks", async () => {
  const { sql } = await setup({ 1: 5, 2: 5 });
  const seen = new Set();
  for (const week of [1, 2]) {
    for (let i = 0; i < 5; i++) seen.add((await assignPainPoint(sql, `p${i}@x.com`, `P${i}`, week)).painPoint.id);
  }
  assert.equal(seen.size, 10);
});

test("none-left once the week's pain points are used up, and existing people keep theirs", async () => {
  const { sql } = await setup({ 1: 2 });
  const a = await assignPainPoint(sql, "a@x.com", "A", 1);
  await assignPainPoint(sql, "b@x.com", "B", 1);
  assert.deepEqual(await assignPainPoint(sql, "c@x.com", "C", 1), { status: "none-left" });
  assert.equal((await assignPainPoint(sql, "a@x.com", "A", 1)).painPoint.id, a.painPoint.id);
});

test("the database itself refuses to give one pain point to two people", async () => {
  const { pg } = await setup({ 1: 1 });
  await pg.query("INSERT INTO assignments (email, name, week, pain_point_id) VALUES ('a@x.com','A',1,'w1-1')");
  await assert.rejects(pg.query("INSERT INTO assignments (email, name, week, pain_point_id) VALUES ('b@x.com','B',1,'w1-1')"));
});

// ---- the rest of the weekly program's SQL (src/lib/program.ts) ----
import { markComplete, undoComplete, saveSubmission, loadMine, loadProgress, addToRoster, removeFromRoster, isOnRoster, loadLevel, hasProof, saveProof, getProof } from "./program.ts";

async function withAttendanceTables(pg) {
  // loadProgress also reads the older results/attendance tables created by db.ts
  await pg.exec("CREATE TABLE IF NOT EXISTS attendance (email TEXT, name TEXT, day INT)");
  await pg.exec("CREATE TABLE IF NOT EXISTS results (email TEXT, name TEXT, day INT)");
}

test("marking a lab complete is saved, can carry a note, and can be undone", async () => {
  const { sql } = await setup();
  const u = { email: "a@x.com", name: "A" };
  await markComplete(sql, u, "s01", null);
  await markComplete(sql, u, "s01", "built the scaffold"); // clicking again updates, never duplicates
  let mine = await loadMine(sql, u.email);
  assert.equal(mine.completions.length, 1);
  assert.equal(mine.completions[0].note, "built the scaffold");
  await undoComplete(sql, u.email, "s01");
  mine = await loadMine(sql, u.email);
  assert.equal(mine.completions.length, 0);
});

test("a submission is saved per week and resubmitting replaces it", async () => {
  const { sql } = await setup();
  const u = { email: "a@x.com", name: "A" };
  const s = { week: 1, url: "https://a.vercel.app/", challenge: "c", solution: "s", copilot: "k" };
  await saveSubmission(sql, u, s);
  await saveSubmission(sql, u, { ...s, url: "https://b.vercel.app/" });
  await saveSubmission(sql, u, { ...s, week: 2 });
  const mine = await loadMine(sql, u.email);
  assert.equal(mine.submissions.length, 2);
  assert.equal(mine.submissions.find((x) => x.week === 1).url, "https://b.vercel.app/");
});

test("participants only see their own activity", async () => {
  const { sql } = await setup();
  await markComplete(sql, { email: "a@x.com", name: "A" }, "s01", null);
  await markComplete(sql, { email: "b@x.com", name: "B" }, "s02", null);
  assert.deepEqual((await loadMine(sql, "a@x.com")).completions.map((c) => c.activity), ["s01"]);
});

test("the facilitator view lists only the roster, matched case-insensitively; remove hides but keeps work", async () => {
  const { pg, sql } = await setup();
  await withAttendanceTables(pg);
  await addToRoster(sql, { name: "Asha", email: "A@x.com" });
  await addToRoster(sql, { name: "Ravi", email: "b@x.com", team: "RPA", github: "ravi-g" });
  await assignPainPoint(sql, "a@x.com", "Asha", 1);
  await assignPainPoint(sql, "boss@x.com", "Boss", 1); // facilitator test click: not on the roster
  await markComplete(sql, { email: "b@x.com", name: "Ravi" }, "s01", "note");
  await saveSubmission(sql, { email: "a@x.com", name: "Asha" }, { week: 1, url: "https://a.vercel.app/", challenge: "c", solution: "s", copilot: "k" });
  let p = await loadProgress(sql);
  assert.deepEqual(p.people.map((x) => x.name), ["Asha", "Ravi"]);
  assert.equal(p.assignments.length, 1);
  assert.match(p.assignments[0].title, /^W1 problem/);
  assert.equal(p.submissions.length, 1);
  assert.equal(p.completions.length, 1);
  await removeFromRoster(sql, "B@X.com");
  p = await loadProgress(sql);
  assert.deepEqual(p.people.map((x) => x.name), ["Asha"]);
  assert.equal(p.completions.length, 0);
});

test("roster membership check is case-insensitive", async () => {
  const { sql } = await setup();
  await addToRoster(sql, { name: "Asha", email: "A@x.com" });
  assert.equal(await isOnRoster(sql, "a@X.com"), true);
  assert.equal(await isOnRoster(sql, "boss@x.com"), false);
});

test("levels: week N opens when week N-1 is submitted", async () => {
  const { sql } = await setup();
  const submit = (email, week) => sql`INSERT INTO submissions (email, name, week, url, challenge, solution, copilot) VALUES (${email}, 'N', ${week}, 'https://a.vercel.app', 'c', 's', 'p')`;
  assert.equal(await loadLevel(sql, "a@x.com"), 1);
  await submit("a@x.com", 1);
  assert.equal(await loadLevel(sql, "a@x.com"), 2);
  await submit("a@x.com", 3); // skipping week 2 does not unlock week 4
  assert.equal(await loadLevel(sql, "a@x.com"), 2);
  for (const w of [2, 4, 5]) await submit("a@x.com", w);
  assert.equal(await loadLevel(sql, "a@x.com"), 5);
});

test("a lab screenshot is stored per person and lab, and replaced on re-upload", async () => {
  const { sql } = await setup();
  assert.equal(await hasProof(sql, "a@x.com", "s03"), false);
  await saveProof(sql, "a@x.com", "s03", "image/png", "AAAA");
  await saveProof(sql, "a@x.com", "s03", "image/jpeg", "BBBB");
  assert.deepEqual(await getProof(sql, "a@x.com", "s03"), { mime: "image/jpeg", data: "BBBB" });
  assert.equal(await hasProof(sql, "b@x.com", "s03"), false);
});
