// A participant's journey through the Copilot team tracks, run against the real SQL and schema on an in-memory Postgres (PGlite).
// npm run test:site
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { PGlite } from "@electric-sql/pglite";
import { PROGRAM_TABLES } from "./schema.ts";

register("./alias-loader.mjs", import.meta.url);
const { loadGtState, setEnrollment, getEnrollment, isEnrolledIn, isStage3Open, loadGtRoster } = await import("./gtDb.ts");
const { savePeSubmission, reviewPeSubmission, loadPeState } = await import("./peDb.ts");

const RESULTS = `CREATE TABLE IF NOT EXISTS results (id SERIAL PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), day INTEGER NOT NULL, email TEXT NOT NULL, name TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, percent INTEGER NOT NULL, answers JSONB NOT NULL)`;

async function setup() {
  const pg = new PGlite();
  await pg.exec(RESULTS);
  for (const ddl of PROGRAM_TABLES) await pg.exec(ddl);
  const sql = async (strings, ...values) => {
    let q = strings[0];
    values.forEach((_, i) => (q += `$${i + 1}${strings[i + 1]}`));
    return (await pg.query(q, values)).rows;
  };
  return { pg, sql };
}
const quiz = (pg, email, day, percent) => pg.query("INSERT INTO results (day, email, name, score, total, percent, answers) VALUES ($1, $2, 'T', 1, 1, $3, '[]'::jsonb)", [day, email, percent]);
const lab = (sql, email, unit) => savePeSubmission(sql, { email, name: "Test" }, unit, { did: "x", prompts: "x", validation: "x" });
const dev = (n) => `gt-dev-${n}`;

test("a participant moves from the Day 7 gate to Stage 3", async () => {
  const { pg, sql } = await setup();
  const me = "p@x.com";

  let s = await loadGtState(sql, me);
  assert.deepEqual([s.open, s.track, s.stage3], [false, null, false]); // before the gate

  await pg.query("INSERT INTO completions (email, name, activity) VALUES ($1, 'P', 'c7')", [me]);
  s = await loadGtState(sql, me);
  assert.equal(s.open, true); // Day 7 done: Stage 2 opens
  assert.equal(s.stage3, false);

  await setEnrollment(sql, me, "dev", "self");
  assert.deepEqual(await getEnrollment(sql, me), { track: "dev", setBy: "self" });
  assert.equal(await isEnrolledIn(sql, me, "dev"), true);
  assert.equal(await isEnrolledIn(sql, me, "qa"), false); // only your own track

  for (const n of [1, 2, 3, 4]) await lab(sql, me, dev(n));
  assert.equal(await isStage3Open(sql, me), false); // 4 of 5 labs
  await lab(sql, me, dev(5));
  assert.equal(await isStage3Open(sql, me), false); // all labs, no quiz
  await quiz(pg, me, 401, 62);
  assert.equal(await isStage3Open(sql, me), false); // quiz below 70
  await quiz(pg, me, 401, 75);
  assert.equal(await isStage3Open(sql, me), true); // labs + quiz passed
});

test("a lab sent back stops the track counting until it is resubmitted", async () => {
  const { pg, sql } = await setup();
  const me = "p@x.com";
  await setEnrollment(sql, me, "dev", "self");
  for (const n of [1, 2, 3, 4, 5]) await lab(sql, me, dev(n));
  await quiz(pg, me, 401, 80);
  assert.equal(await isStage3Open(sql, me), true);

  assert.equal(await reviewPeSubmission(sql, me, dev(3), "changes", "Show the failing test", "f@x.com"), true);
  let s = await loadGtState(sql, me);
  assert.equal(s.stage3, false);
  assert.equal(s.subs.find((x) => x.unit === dev(3)).feedback, "Show the failing test");

  await lab(sql, me, dev(3)); // resubmit: back to pending, counts again
  s = await loadGtState(sql, me);
  assert.equal(s.subs.find((x) => x.unit === dev(3)).status, "pending");
  assert.equal(s.stage3, true);
});

test("another track or another course does not open Stage 3", async () => {
  const { pg, sql } = await setup();
  const me = "p@x.com";
  await setEnrollment(sql, me, "qa", "self");
  for (const n of [1, 2, 3, 4, 5]) await lab(sql, me, dev(n)); // labs of the wrong track
  await quiz(pg, me, 401, 90); // dev quiz
  assert.equal(await isStage3Open(sql, me), false);
  await quiz(pg, me, 301, 100); // Prompt Engineering quiz
  assert.equal(await isStage3Open(sql, me), false);
  assert.equal((await loadPeState(sql, me)).submitted.length, 0); // track labs do not leak into the Prompt Engineering state
});

test("people who already started the weekly apps keep access", async () => {
  const { pg, sql } = await setup();
  await pg.query("INSERT INTO submissions (email, name, week, url, challenge, solution, copilot) VALUES ('old@x.com', 'Old', 1, 'https://a.b', 'c', 's', 'c')");
  assert.equal(await isStage3Open(sql, "old@x.com"), true);
  assert.equal(await isStage3Open(sql, "new@x.com"), false);
});

test("the facilitator roster shows stage, track and progress per person", async () => {
  const { pg, sql } = await setup();
  await pg.query("INSERT INTO roster (email, name, team) VALUES ('a@x.com', 'A', 'MoHI'), ('b@x.com', 'B', 'Fabric')");
  await pg.query("INSERT INTO completions (email, name, activity) VALUES ('a@x.com', 'A', 'c7')");
  await setEnrollment(sql, "a@x.com", "dev", "facilitator:f@x.com");
  await lab(sql, "a@x.com", dev(1));
  const r = await loadGtRoster(sql);
  assert.equal(r.people.length, 2);
  assert.ok(r.gate.has("a@x.com") && !r.gate.has("b@x.com"));
  assert.equal(r.enrol.find((e) => e.email === "a@x.com").track, "dev");
  assert.equal(r.subs.filter((x) => x.email === "a@x.com").length, 1);
});
