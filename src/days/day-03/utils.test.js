const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isValidEmail, isPalindrome, chunk, sumRange } = require("./utils");

// todo: these turn into real checks as Copilot fills each stub in utils.js. Remove "todo" per test when done.
test("isValidEmail accepts and rejects", { todo: true }, () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("user@.com"), false);
  assert.equal(isValidEmail(null), false);
});

test("isPalindrome ignores case and punctuation", { todo: true }, () => {
  assert.equal(isPalindrome("A man, a plan, a canal: Panama"), true);
  assert.equal(isPalindrome("hello"), false);
});

test("chunk splits with a shorter last chunk", { todo: true }, () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 3), []);
});

test("sumRange is inclusive on both ends", { todo: true }, () => {
  assert.equal(sumRange(1, 5), 15);
  assert.equal(sumRange(3, 3), 3);
});
