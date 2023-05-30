const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const isEmailVerified = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            res.json({ status: false, message: "not valid user" })
        }
        const user = await prisma.User.findUnique({
            where: {
                id: id,
            }
        });
        if (user.emailVerified) {
            next()
        } else {
            res.json({ status: false, message: "email not verified", resendEmailLink: process.env.BASE_URL + "/re-verify-email" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
module.exports = { isEmailVerified }