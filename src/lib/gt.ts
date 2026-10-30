// GitHub Copilot team tracks (Stage 2 of the Copilot course): unit ids, quiz numbers and completion rules. Pure functions (no "@/" imports) so the node tests can load this file.
// A track has 5 sessions (units "gt-<track>-1" .. "gt-<track>-5") and one track quiz (401 dev, 402 qa, 403 powerbi, 404 fabric, 405 ai).
// A track is done when all 5 session labs are submitted (and not sent back) and the track quiz is passed.
export const GT_TRACKS = ["dev", "qa", "powerbi", "fabric", "ai"] as const;
export type GtTrack = (typeof GT_TRACKS)[number];
export const GT_QUIZ_MIN = 400;
export const GT_SESSIONS = 5;

export const gtUnitId = (track: string, n: number) => `gt-${track}-${n}`;
export const isGtUnit = (unit: string) => new RegExp(`^gt-(${GT_TRACKS.join("|")})-[1-${GT_SESSIONS}]$`).test(unit);
export const gtTrackOfUnit = (unit: string) => unit.split("-")[1] as GtTrack;
export const gtQuizOf = (track: string) => GT_QUIZ_MIN + 1 + GT_TRACKS.indexOf(track as GtTrack);

export function gtTrackDone(track: string, submitted: Set<string>, passed: Set<number>) {
  const labs = Array.from({ length: GT_SESSIONS }, (_, i) => gtUnitId(track, i + 1));
  return labs.every((u) => submitted.has(u)) && passed.has(gtQuizOf(track));
}

// Stage 3 (weekly apps) opens when the track the person is enrolled in is done. People who already started the weekly apps before the tracks
// existed keep their access (`alreadyStarted`: they have a pain point or a submission), so nobody loses work in progress.
export const gtStage3Open = (enrolledTrack: string | null, submitted: Set<string>, passed: Set<number>, alreadyStarted: boolean) =>
  alreadyStarted || (enrolledTrack !== null && gtTrackDone(enrolledTrack, submitted, passed));
export const gtTrackOfQuiz = (quiz: number) => GT_TRACKS[quiz - GT_QUIZ_MIN - 1] as GtTrack | undefined;

// Stage 2 opens once the Day 7 gate (completion "c7") is marked done.
export const GT_UNLOCK_ACTIVITY = "c7";
