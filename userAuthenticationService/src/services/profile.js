const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadImageToS3 } = require("../utils/awsUploadImage");
const crypto = require("crypto");


const create = async (req, res) => {
    try {
      const { bio, profession, id } = req.body;
      const imageFile = req.files.imageFile.data;
      console.log("image >>", imageFile);
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
    create
  }