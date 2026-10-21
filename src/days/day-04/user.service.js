// Day 4 (Dev): seeded bug. Use Copilot Chat (/explain, then /fix) to find and fix the root cause.

const users = [
  { id: 1, name: "Asha", role: "dev" },
  { id: 2, name: "Ravi", role: "qa" },
];

function getUserName(userList, id) {
  const user = userList.find((u) => u.id === id);
  return user.name;
}

module.exports = { users, getUserName };
