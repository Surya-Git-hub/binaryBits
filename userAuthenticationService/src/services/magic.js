const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createJWT } = require("../utils/createJWT");
const { verifyMail, sendMagicLink } = require("../utils/verifyMail");



const login = async (req, res) => {
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

const verifyLink = async (req, res, result) => {
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

module.exports = {
    login,
    verifyLink
}