// A day opens at 00:00 on its date in TRAINING_TZ (default India time). Facilitators bypass this.
export const isOpen = (date: string, now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: process.env.TRAINING_TZ ?? "Asia/Kolkata" }).format(now) >= date;
