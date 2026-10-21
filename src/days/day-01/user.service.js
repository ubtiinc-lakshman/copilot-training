// User service: second small module for Chat practice (summaries today, /fix on Day 4).

const users = [
  { id: 1, name: "Asha", role: "dev" },
  { id: 2, name: "Ravi", role: "qa" },
];

function getUserName(userList, id) {
  const user = userList.find((u) => u.id === id);
  return user.name; // Day 4 seeded bug: throws when the id does not exist
}

function getUsersByRole(userList, role) {
  return userList.filter((u) => u.role === role);
}

module.exports = { users, getUserName, getUsersByRole };
