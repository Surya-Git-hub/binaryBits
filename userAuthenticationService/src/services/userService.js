// const { v4: uuid } = require("uuid");
// const user = require("../database/user");
const { Prisma, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllUsers = () => {
  const allusers = prisma.user.findMany();
  return allusers;
};

// const getOneuser = () => {
//   return;
// };

const createNewUser = (newUser) => {
  const userToInsert = {
    ...newUser,
    verified: false,
  };
  const createdUser = prisma.user.create(userToInsert);
  return createdUser;
};

// const updateOneuser = () => {
//   return;
// };

// const deleteOneuser = () => {
//   return;
// };

module.exports = {
  getAllUsers,
  // getOneuser,
  createNewUser,
  // updateOneuser,
  // deleteOneuser,
};