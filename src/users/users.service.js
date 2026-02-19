import { prisma } from "../utils/prisma.js";

export async function findUserByEmail(email) {
return prisma.user.findUnique({
where: { email },
});
}

export async function createUser({ userData }) {
return prisma.user.create({
data: userData,
});
}
export async function listUsers() {
return prisma.user.findMany();
}

export async function getUserById(id) {
return prisma.user.findUnique({
where: { id },
});
}

export async function deleteUser(id) {
return prisma.user.delete({
where: { id },
});
}
// modif 
export async function updateUser(id, data) {
return prisma.user.update({
where: { id },
data
});
}
const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true, // si tu l’as
};
export async function countUsers() {
  return prisma.user.count();
}
export async function updateUserPassword(id, password) {
  return prisma.user.update({
    where: { id },
    data: { password },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
export async function createManyUsers(users) {
  const createdUsers = [];

  for (const user of users) {
    const created = await prisma.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    createdUsers.push(created);
  }

  return createdUsers;
}
