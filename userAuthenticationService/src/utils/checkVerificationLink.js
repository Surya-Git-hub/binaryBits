const Cryptr = require('cryptr');
const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require('dotenv').config();

const checkVerificationLink = async (token) => { ///this can be done using jwt easily
    const secret = process.env.CSEC;
    const cryptr = new Cryptr(secret);
    const decryptedToken = cryptr.decrypt(token);
    let [email, userId] = decryptedToken.split(" ");
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    console.log("email >>", email, " ID >> ", userId, " usedId >> ", user.id);
    return ({
        match: (user.id === userId),
        email: email,
        id: user.id
    })
};

module.exports = { checkVerificationLink };