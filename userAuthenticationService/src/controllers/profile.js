const profileService = require("../services/profile");
const {
    isEmailValid,
    isPassValid,
    isNameValid,
    hasValue,
} = require("../helpers");

const create = async (req, res) => {
    try {
        const { profession, bio, imageFile } = req.body;
        if (!hasValue(profession) && !hasValue(bio) && !hasValue(imageFile)) {
            return res
                .status(200)
                .json({ status: "Nothing saved because nothing to save" });
        }
        const professionRegex = /^[a-zA-Z\s]+$/;
        const bioRegex = /^.{0,150}$/;
        if (!professionRegex.test(profession) && profession !== "") {
            return res.status(400).json({ error: "profession is invalid" });
        }
        if (!bioRegex.test(bio) && bio !== "") {
            return res.status(400).json({ error: "bio is invalid" });
        }
        if (imageFile) {
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg", ".img"];
            const fileExtension = imageFile.originalname
                .split(".")
                .pop()
                .toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ error: "Invalid imageFile extension" });
            }
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (imageFile.size > maxSize) {
                return res.status(400).json({ error: "File size exceeds the limit" });
            }
        }

        await profileService.create(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

module.exports = {
    create,
};
