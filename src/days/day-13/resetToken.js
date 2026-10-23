// Day 13 (Dev): validate a password-reset token (expiry, one-time use). Generate unit tests for it.
const TTL_MS = 15 * 60 * 1000;

function createTokenStore(now = Date.now) {
  const tokens = new Map(); // token -> { userId, issuedAt, used }
  return {
    issue(token, userId) {
      if (!token || !userId) throw new TypeError("token and userId are required");
      tokens.set(token, { userId, issuedAt: now(), used: false });
    },
    // Returns { ok: true, userId } or { ok: false, reason }.
    redeem(token) {
      const t = tokens.get(token);
      if (!t) return { ok: false, reason: "unknown" };
      if (t.used) return { ok: false, reason: "used" };
      if (now() - t.issuedAt > TTL_MS) return { ok: false, reason: "expired" };
      t.used = true;
      return { ok: true, userId: t.userId };
    },
  };
}

module.exports = { createTokenStore, TTL_MS };
