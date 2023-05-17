
const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { checkDuplicateEmail } = require("../utils/checkDuplicateEmail");
const { comparePasswords } = require("../utils/comparePasswords");
const {createJWT} = require("../utils/createJWT")

const getAllUsers = async () => {
  const allusers = await prisma.user.findMany();
  console.log(allusers);
  return allusers;
};

// const getOneuser = () => {
//   return;
// };




const createNewUser = async (req, res) => {
  try {
    let { name, password, email } = req.body;
    if (await checkDuplicateEmail(email)) {
      return res.status(400).json({ error: 'email already exist' });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userToInsert = {
      name, pass: hashedPassword, email,
      emailVerified: false,
    };
    const createdUser = await prisma.user.create({ data: userToInsert });
    // let vlink = generateVerificationLink(createdUser.id, email, name);
    // let verificaton = verifyEmail(email, name, vlink);
    const token = createJWT(createdUser.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, createdUser });
    // res.status(201).send({ status: "OK", data: createdUser });}
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }
    if (!comparePasswords(password, user.pass)) {
      return res.json({ message: 'Incorrect password or email' })
    }
    const token = createJWT(user.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }
}

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
  userLogin,
  // updateOneuser,
  // deleteOneuser,
};