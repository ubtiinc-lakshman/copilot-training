// Copilot output #1 (Dev): pagination helper
function paginate(items, page = 1, pageSize = 10) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");
  const size = Math.max(1, Math.floor(pageSize));
  const current = Math.max(1, Math.floor(page));
  const start = (current - 1) * size;
  return {
    page: current,
    pageSize: size,
    total: items.length,
    items: items.slice(start, start + size),
  };
}

module.exports = { paginate };
