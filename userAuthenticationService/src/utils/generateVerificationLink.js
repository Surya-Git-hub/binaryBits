
const Cryptr = require('cryptr');
require('dotenv').config();

const generateVerificationLink = (email, userId) => {
    const secret = process.env.CSEC;
    const cryptr = new Cryptr(secret);
    const encryptedToken = cryptr.encrypt(email + " " + userId);
    const verificationLink = `${process.env.BASE_URL}/verify?token=${encryptedToken}`;
    console.log("verificationlink>>>", verificationLink);
    return verificationLink;
};

module.exports = { generateVerificationLink };