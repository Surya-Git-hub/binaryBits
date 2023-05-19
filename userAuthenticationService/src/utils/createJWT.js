require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createJWT = async (id,time = 3 * 24 * 60 * 60) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: time,
    });
};