// Day 8 (Dev): the function to rewrite in a language you do NOT use daily (Go, Rust, Kotlin, ...).
// The rewrite must keep identical edge-case behavior. Ask Copilot to note anything it cannot guarantee.

export const ACCEPTED_EXAMPLES = ["+91 98765 43210", "(555) 123-4567", "555-123-4567", "5551234567", "+1 555 123 4567"];
export const REJECTED_EXAMPLES = ["", "12345", "555-CALL-NOW", "++1 555 123 4567", "555 123 45678901234", "  "];

/** Accepts an optional leading +, then 10 to 15 digits, with spaces, dashes, dots and parentheses allowed between them. */
export function validatePhone(input: string): boolean {
  if (typeof input !== "string") return false;
  const trimmed = input.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
