import { test } from "node:test";
import assert from "node:assert/strict";
import { gtQuizOf, gtStage3Open, gtTrackDone, gtTrackOfQuiz, gtTrackOfUnit, gtUnitId, isGtUnit } from "./gt.ts";

test("unit ids and quiz numbers", () => {
  assert.equal(gtUnitId("qa", 3), "gt-qa-3");
  assert.ok(isGtUnit("gt-powerbi-5"));
  assert.ok(!isGtUnit("gt-powerbi-6"));
  assert.ok(!isGtUnit("gt-sales-1"));
  assert.ok(!isGtUnit("l2-qa"));
  assert.equal(gtTrackOfUnit("gt-fabric-2"), "fabric");
  assert.deepEqual(["dev", "qa", "powerbi", "fabric", "ai"].map(gtQuizOf), [401, 402, 403, 404, 405]);
});

test("stage 3 needs the track the person is enrolled in", () => {
  const all = new Set([1, 2, 3, 4, 5].map((n) => gtUnitId("qa", n)));
  assert.equal(gtStage3Open(null, all, new Set([402]), false), false); // not enrolled
  assert.equal(gtStage3Open("dev", all, new Set([402]), false), false); // finished a different track
  assert.equal(gtStage3Open("qa", all, new Set(), false), false); // quiz missing
  assert.equal(gtStage3Open("qa", all, new Set([402]), false), true);
  assert.equal(gtStage3Open(null, new Set(), new Set(), true), true); // already running the weekly apps
  assert.equal(gtTrackOfQuiz(403), "powerbi");
  assert.equal(gtTrackOfQuiz(400), undefined);
});

test("a track needs all five labs and its quiz", () => {
  const labs = (track, n) => new Set(Array.from({ length: n }, (_, i) => gtUnitId(track, i + 1)));
  assert.equal(gtTrackDone("dev", labs("dev", 4), new Set([401])), false);
  assert.equal(gtTrackDone("dev", labs("dev", 5), new Set()), false);
  assert.equal(gtTrackDone("dev", labs("dev", 5), new Set([402])), false); // another track's quiz
  assert.equal(gtTrackDone("dev", labs("dev", 5), new Set([401])), true);
});
