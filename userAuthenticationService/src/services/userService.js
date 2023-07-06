const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { checkDuplicateEmail } = require("../utils/checkDuplicateEmail");
const { comparePasswords } = require("../utils/comparePasswords");
const { createJWT } = require("../utils/createJWT");
const {
  generateVerificationLink,
} = require("../utils/generateVerificationLink");
const { verifyMail, sendMagicLink } = require("../utils/verifyMail");
const { uploadImageToS3 } = require("../utils/awsUploadImage");
const crypto = require("crypto");

const getAllUsers = async () => {
  try {
    const allusers = await prisma.User.findMany();
    console.log(allusers);
    return allusers;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getOneUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await prisma.User.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    } else {
      return res.status(200).json({
        message: "user details",
        success: true,
        user: {
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          profile: user.profile,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getSomeUsers = async (req, res) => {
  try {
    const ids = req.query?.userIds;
    const userIds = ids.split(",");
    if (userIds.length <= 0) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    let users = await prisma.User.findMany({
      select: { name: true, email: true, emailVerified: true, profile: true },
      where: {
        id: { in: userIds },
      },
    });
    if (!users) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    return res.status(200).json({
      message: "found users",
      success: true,
      users: [...users],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateOneUser = async (req, res) => {
  try {
    const { name, email, id, level } = req.body;
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateSomeUsers = async (req, res) => {
  try {
    const { name, email, ids,level } = req.body;
    if (ids.length <= 0) {
      return res.status(400).json({ error: "ids are required in body" });
    }
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateAllUsers = async (req, res) => {
  try {
    const { name, email,level } = req.body;
    let updatedUser;
    if (level == 2) {
      updatedUser = await prisma.user.updateMany({
        data: {
          name: name,
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 1) {
      updatedUser = await prisma.user.updateMany({
        data: {
          email: email,
          emailVerified: false,
        },
      });
    } else if (level == 0) {
      updatedUser = await prisma.user.updateMany({
        data: {
          name: name,
        },
      });
    } else {
      return res.status(400).json({ error: "invalid update level" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteOneUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteSomeUsers = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const createNewUser = async (req, res) => {
  try {
    let { name, password, email } = req.body;
    if (await checkDuplicateEmail(email)) {
      return res.status(400).json({ error: "email already exist" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userToInsert = {
      name,
      pass: hashedPassword,
      email,
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
    return res.status(201).json({
      message: "User signed in successfully",
      success: true,
      createdUser,
      emaiVerification: verificaton,
    });
    // res.status(201).send({ status: "OK", data: createdUser });}
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
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
      return res.status(401).json({ message: "Incorrect password or email" });
    }
    const token = await createJWT(user.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: "lax",
      // path: '/refresh_token',
    });
    // res.cookies.set("set",true);
    if (user.profile) {
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        userData: {
          user: user.name,
          email: user.email,
          profileComplete: true,
        },
      });
    } else {
      return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token,
        userData: {
          user: user.name,
          email: user.email,
          profileComplete: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const verifyEmail = async (req, res, result) => {
  try {
    const updatedUser = await prisma.User.update({
      where: { id: result.id },
      data: {
        emailVerified: true,
      },
    });
    console.log("updated user >> ", updatedUser);
    return res
      .status(200)
      .json({ message: "email verified successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const reVerifyEmail = async (req, res) => {
  try {
    let { email, id, name } = req.body;
    let vlink = await generateVerificationLink(email, id);
    let verificaton = await verifyMail(email, name, vlink);
    return res.status(200).json({
      message: "email resent successfully",
      success: true,
      emailVerification: verificaton,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
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
    return res.status(200).json({
      message: "Magic Link sent successfully",
      success: true,
      sendStatus: verificaton,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const verifyMagicLink = async (req, res, result) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const token = await createJWT(user.id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    return res
      .status(200)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const createProfile = async (req, res) => {
  try {
    const { bio, profession, id } = req.body;
    const imageFile = req.files.imageFile.data;
    console.log("image >>", imageFile);
    // console.log("req",req);
    const generateFileName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString("hex");
    const s3Response = await uploadImageToS3(imageFile, generateFileName);
    const profileToInsert = {
      bio,
      profilePhoto: generateFileName,
      profession,
      user: id,
    };
    const createdProfile = await prisma.Profile.create({
      data: profileToInsert,
    });
    const updatedUser = await prisma.User.update({
      where: { id: id },
      data: {
        profile: createdProfile.id,
      },
    });
    res.status(201).json({ savedProfile, updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getSomeUsers,
  createNewUser,
  updateOneUser,
  updateSomeUsers,
  updateAllUsers,
  deleteOneUser,
  deleteSomeUsers,
  deleteAllUsers,
  userLogin,
  verifyEmail,
  reVerifyEmail,
  magicLogin,
  verifyMagicLink,
  createProfile,
};
