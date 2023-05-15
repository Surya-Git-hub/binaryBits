// const { v4: uuid } = require("uuid");
// const user = require("../database/user");
const { Prisma, PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const getAllUsers = () => {
  const allusers = prisma.user.findMany();
  return allusers;
};

// const getOneuser = () => {
//   return;
// };
async function checkDuplicateEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user !== null;
}

const createNewUser = async (req, res) => {
  let { name, password, email } = req.body;
  if (await checkDuplicateEmail(email)) {
    return res.status(400).json({ error: 'email already exist' });
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password,salt);
  const userToInsert = {
    name, hashedPassword, email,
    emailVerified: false,
  };
  const createdUser = prisma.user.create(userToInsert);
  res.status(201).send({ status: "OK", data: createdUser });
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