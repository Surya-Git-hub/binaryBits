
const Cryptr = require('cryptr');
require('dotenv').config();

const generateVerificationLink = async (email, userId) => { ///this can be done using jwt easily
    const secret = process.env.CSEC;
    const cryptr = new Cryptr(secret);
    const encryptedToken = cryptr.encrypt(email + " " + userId);
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${encryptedToken}`;
    console.log("verificationlink>>>", verificationLink);
    return verificationLink;
};

module.exports = { generateVerificationLink };