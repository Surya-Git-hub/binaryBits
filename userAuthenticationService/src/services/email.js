const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateVerificationLink } = require("../utils/generateVerificationLink");
const { verifyMail, sendMagicLink } = require("../utils/verifyMail");



const verify = async (req, res, result) => {
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

const reVerify = async (req, res) => {
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

module.exports = {
    verify,
    reVerify
}