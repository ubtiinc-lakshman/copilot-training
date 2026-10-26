// Today's date in TRAINING_TZ (default India time), as yyyy-mm-dd.
export const todayISO = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: process.env.TRAINING_TZ ?? "Asia/Kolkata" }).format(now);

// A day opens at 00:00 on its date in TRAINING_TZ (default India time). Facilitators bypass this.
export const isOpen = (date: string, now = new Date()) => todayISO(now) >= date;

// The 30 library lessons are self-learning and always open. Weekly program activities still use isOpen.
// Quiz numbers above 100 belong to weekly sessions (101 = s01); those open on the session's date, library quizzes are always open.
export const quizOpen = (day: number, sessionDate?: string) => (day > 100 ? !!sessionDate && isOpen(sessionDate) : isLessonOpen());

export const isLessonOpen = () => true;
