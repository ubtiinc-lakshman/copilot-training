// Day 6 (Dev): ask Copilot to document this module, then CHECK the docstring against the real behavior.

/**
 * Sliding-window rate limiter. Never throws. Allows up to `max` requests
 * per `windowMs` for each key and always returns a result object.
 */
function createRateLimiter(options) {
  const { max, windowMs, now = Date.now } = options;
  const windows = new Map();

  return function check(key) {
    const t = now();
    let w = windows.get(key);
    if (!w || t - w.start >= windowMs) {
      w = { start: t, count: 0 };
      windows.set(key, w);
    }
    w.count += 1;
    return { allowed: w.count <= max, remaining: Math.max(0, max - w.count) };
  };
}

module.exports = { createRateLimiter };
