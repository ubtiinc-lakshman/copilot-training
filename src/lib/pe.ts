// Prompt Engineering course: unit ids, quiz numbers and the level rules. Pure functions (no "@/" imports) so the node tests can load this file.
// Quiz numbers (stored in the same `quizzes` and `results` tables as the Copilot course): 301 = Level 1, 311-318 = Level 2 tracks, 321 = Level 3.
export const PE_PASS_PERCENT = 70;
export const PE_QUIZ_MIN = 300;

export const PE_TRACKS = ["saas", "powerbi", "snowflake", "azure", "qa", "ai", "innovation", "leadership"] as const;
export type PeTrack = (typeof PE_TRACKS)[number];

// The unit a submission belongs to: "l1", "l2-<track>" or "l3".
export const peUnitIds = ["l1", ...PE_TRACKS.map((t) => `l2-${t}`), "l3"];
export const peQuizOf = (unit: string) => (unit === "l1" ? 301 : unit === "l3" ? 321 : 311 + PE_TRACKS.indexOf(unit.slice(3) as PeTrack));
export const peLevelOfQuiz = (quiz: number) => (quiz === 301 ? 1 : quiz === 321 ? 3 : 2);

// Lab review: a facilitator marks a submission approved or sends it back. "changes" blocks the unit until the person resubmits (which resets it to pending).
export const PE_REVIEW_STATUSES = ["pending", "approved", "changes"] as const;
export type PeReviewStatus = (typeof PE_REVIEW_STATUSES)[number];

// A unit is done when its lab was submitted and its quiz passed. `submitted` = unit ids (not sent back), `passed` = quiz numbers with a best score >= the pass mark.
export const peUnitDone = (unit: string, submitted: Set<string>, passed: Set<number>) => submitted.has(unit) && passed.has(peQuizOf(unit));

// The level a person is on: Level 2 opens when Level 1 is done, Level 3 when any one Level 2 track is done.
export function peLevel(submitted: Iterable<string>, passed: Iterable<number>) {
  const s = new Set(submitted);
  const p = new Set(passed);
  if (!peUnitDone("l1", s, p)) return 1;
  return PE_TRACKS.some((t) => peUnitDone(`l2-${t}`, s, p)) ? 3 : 2;
}
