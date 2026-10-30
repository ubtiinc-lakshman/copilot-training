import { test } from "node:test";
import assert from "node:assert/strict";
import { peLevel, peQuizOf, peUnitIds, PE_TRACKS } from "./pe.ts";

test("quiz numbers", () => {
  assert.equal(peQuizOf("l1"), 301);
  assert.equal(peQuizOf("l2-saas"), 311);
  assert.equal(peQuizOf("l2-leadership"), 318);
  assert.equal(peQuizOf("l3"), 321);
  assert.equal(peUnitIds.length, 2 + PE_TRACKS.length);
});

test("levels need the lab and the quiz", () => {
  assert.equal(peLevel([], []), 1);
  assert.equal(peLevel(["l1"], []), 1); // lab without a passed quiz
  assert.equal(peLevel([], [301]), 1); // quiz without the lab
  assert.equal(peLevel(["l1"], [301]), 2);
  assert.equal(peLevel(["l1", "l2-qa"], [301]), 2);
  assert.equal(peLevel(["l1", "l2-qa"], [301, 315]), 3);
  assert.equal(peLevel(["l1", "l2-qa"], [301, 311]), 2); // passed a different track's quiz
});
