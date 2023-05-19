require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = async (token) => {
    try {
        var data = await jwt.verify(token, process.env.TOKEN_KEY);
        console.log("data>>>", data);
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = { verifyJWT };