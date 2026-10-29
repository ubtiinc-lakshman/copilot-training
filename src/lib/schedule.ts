// Today's date in TRAINING_TZ (default India time), as yyyy-mm-dd.
export const todayISO = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: process.env.TRAINING_TZ ?? "Asia/Kolkata" }).format(now);

// A day opens at 00:00 on its date in TRAINING_TZ (default India time). Facilitators bypass this.
export const isOpen = (date: string, now = new Date()) => todayISO(now) >= date;

// The 30 library lessons are self-learning and always open. Common days still use isOpen (dated live days); the weekly app program is self-paced and gated by level.
// Quiz numbers above 100 belong to weekly sessions (101 = s01). The weekly program is self-paced, so every quiz that exists is open.
export const quizOpen = (day: number, sessionDate?: string) => day <= 100 || !!sessionDate;

export const isLessonOpen = () => true;
