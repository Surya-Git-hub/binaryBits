
const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { checkDuplicateEmail } = require("../utils/checkDuplicateEmail");
const { comparePasswords } = require("../utils/comparePasswords");
const { createJWT } = require("../utils/createJWT")
const { generateVerificationLink } = require("../utils/generateVerificationLink");
const { verifyMail,sendMagicLink } = require("../utils/verifyMail");

const getAllUsers = async () => {
  try {
    const allusers = await prisma.user.findMany();
    console.log(allusers);
    return allusers;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }

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
    let vlink = await generateVerificationLink(email, createdUser.id);
    let verificaton = await verifyMail(email, name, vlink);
    const token = await createJWT(createdUser.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, createdUser, emaiVerification: verificaton });
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
      res.json({ message: "User doesn't exist" });
    }
    if (!comparePasswords(password, user.pass)) {
      res.json({ message: 'Incorrect password or email' })
    }
    const token = await createJWT(user.id);
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

const verifyEmail = async (req, res, result) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: result.id },
      data: {
        emailVerified: true,
      },
    });
    console.log("updated user >> ", updatedUser);
    res.status(201).json({ message: "email verified successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }
}

const reVerifyEmail = async (req, res) => {
  try {
    let { email, id, name } = req.body;
    let vlink = await generateVerificationLink(email, id);
    let verificaton = await verifyMail(email, name, vlink);
    res
      .status(201)
      .json({ message: "email resent successfully", success: true, emailVerification: verificaton });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }
}
const magicLogin = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.json({ message: "User doesn't exist" });
    }
    const token = await createJWT(user.id, 60 * 5);
    let vlink = `${process.env.BASE_URL}/verify-magic-link?token=${token}`;
    let verificaton = await sendMagicLink(email, user.name, vlink);
    res
      .status(201)
      .json({ message: "Magic Link sent successfully", success: true, sendStatus: verificaton });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' })
  }
}

const verifyMagicLink = async (req, res, result) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: result.id
      }
    });
    if (!user) {
      res.json({ message: "User doesn't exist" });
    }
    const token = await createJWT(user.id);
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
  verifyEmail,
  reVerifyEmail,
  magicLogin,
  verifyMagicLink
  // updateOneuser,
  // deleteOneuser,
};