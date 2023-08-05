const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const create = async (req, res) => {
  try {
    const { name, profession, bio, country, organization, profilePhoto, githubProfile } = req.body;
    // console.log(name);
    const profileToInsert = {
      profession, bio, country, profilePhoto, github: githubProfile, organization,
    };
    const createdProfile = await prisma.profile.create({
      data: {
        ...profileToInsert,
        user: {
          connect: { id: req.body.id },
        },
      },
    });

    // Update the 'hasProfile' field in the user model to true
    let userUpdated = await prisma.user.update({
      where: { id: req.body.id },
      data: {
        hasProfile: true,
        name: name,
      },
    });

    return res.status(201).json({
      message: "User profile created successfully",
      success: true,
      createdProfile, userUpdated
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const get = async (req, res) => {
  try {
    const id = req.params?.userId;
    const profile = await prisma.profile.findUnique({
      where: {
        userId: id
      }
    })
    return res.status(200).json({
      message: "user profile",
      success: true,
      profile: profile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" })
  }
}

const update = async (req, res) => {
  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.body.id },
    });
    if (!existingProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    const { updates } = req.body
    const updatedProfile = await prisma.profile.update({
      where: { userId: req.body.id },
      data: { ...updates },
    });
    return res.status(200).json({
      message: "user profile updated",
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" })
  }
}

const remove = async (req, res) => {
  try {
    const existingProfile = await prisma.profile.delete({
      where: { userId: req.body.id },
    });
    return res.status(200).json({
      message: "user profile deleted",
      success: true,
      count: existingProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" })
  }
}

module.exports = {
  create, get, update, remove
}