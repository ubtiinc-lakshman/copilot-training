// Quiz grading shared by the browser (instant feedback) and the server (the score that is stored).
export type Question = {
  q: string;
  type: "mcq" | "tf" | "short";
  options?: string[];
  correct?: number | boolean; // mcq: option index, tf: true/false
  keywords?: string[]; // short: any keyword (case-insensitive) counts as correct
  answer: string; // shown in facilitator mode
};

export type Given = string | number | boolean | null | undefined;

export function isCorrect(q: Question, given: Given): boolean {
  if (given === undefined || given === null || given === "") return false;
  if (q.type === "short") return (q.keywords ?? []).some((k) => String(given).toLowerCase().includes(k.toLowerCase()));
  return given === q.correct;
}

export function gradeQuiz(questions: Question[], answers: Given[]) {
  const score = questions.filter((q, i) => isCorrect(q, answers[i])).length;
  const total = questions.length;
  return { score, total, percent: Math.round((score / total) * 100) };
}
