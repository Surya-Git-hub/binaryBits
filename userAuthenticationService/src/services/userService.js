
const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { checkDuplicateEmail } = require("../utils/checkDuplicateEmail");
const { comparePasswords } = require("../utils/comparePasswords");
const { createJWT } = require("../utils/createJWT")
const { generateVerificationLink } = require("../utils/generateVerificationLink");
const { verifyMail, sendMagicLink } = require("../utils/verifyMail");
const { uploadImageToS3 } = require("../utils/awsUploadImage");

const getAllUsers = async () => {
  try {
    const allusers = await prisma.User.findMany();
    console.log(allusers);
    return allusers;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
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
    const createdUser = await prisma.User.create({ data: userToInsert });
    let vlink = await generateVerificationLink(email, createdUser.id);
    let verificaton = await verifyMail(email, name, vlink);
    const token = await createJWT(createdUser.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    return res
      .status(201)
      .json({ message: "User signed in successfully", success: true, createdUser, emaiVerification: verificaton });
    // res.status(201).send({ status: "OK", data: createdUser });}
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    if (!comparePasswords(password, user.pass)) {
      return res.status(401).json({ message: 'Incorrect password or email' })
    }
    const token = await createJWT(user.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: 'none',
    });
    if (user.profile) {
      return res.status(200).json({ message: "User logged in successfully", success: true, token, userData: { user: user.name, email: user.email, profileComplete: true } });
    } else {
      return res.status(200).json({ message: "User logged in successfully", success: true, token, userData: { user: user.name, email: user.email, profileComplete: false } });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
}

const verifyEmail = async (req, res, result) => {
  try {
    const updatedUser = await prisma.User.update({
      where: { id: result.id },
      data: {
        emailVerified: true,
      },
    });
    console.log("updated user >> ", updatedUser);
    return res.status(200).json({ message: "email verified successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
}

const reVerifyEmail = async (req, res) => {
  try {
    let { email, id, name } = req.body;
    let vlink = await generateVerificationLink(email, id);
    let verificaton = await verifyMail(email, name, vlink);
    return res
      .status(200)
      .json({ message: "email resent successfully", success: true, emailVerification: verificaton });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
}
const magicLogin = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const token = await createJWT(user.id, 60 * 5);
    let vlink = `${process.env.BASE_URL}/verify-magic-link?token=${token}`;
    let verificaton = await sendMagicLink(email, user.name, vlink);
    return res
      .status(200)
      .json({ message: "Magic Link sent successfully", success: true, sendStatus: verificaton });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
}

const verifyMagicLink = async (req, res, result) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: result.id
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const token = await createJWT(user.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    return res.status(200).json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
  }
}

const createProfile = async (req, res) => {
  try {
    const { bio, profession, imageFile, id } = req.body;
    const s3Response = await uploadImageToS3(imageFile);
    const profileToInsert = {
      bio, profilePhoto: s3Response.Location,
      profession,
      user: id
    };
    const createdProfile = await prisma.Profile.create({ data: profileToInsert });
    const updatedUser = await prisma.User.update({
      where: { id: id },
      data: {
        profile: createdProfile.id,
      },
    });
    res.status(201).json({ savedProfile, updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error' })
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
  verifyMagicLink,
  createProfile,
  // updateOneuser,
  // deleteOneuser,
};