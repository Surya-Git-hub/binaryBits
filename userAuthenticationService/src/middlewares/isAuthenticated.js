require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ status: false })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            console.log(data);
            if (err) {
                res.status(401).json({ status: false })
            } else {
                const user = await prisma.user.findUnique({
                    where: {
                        id: data.id
                    }
                });
                console.log(user);
                if (user) {
                    req.body = {
                        ...req.body,
                        email: user.email,
                        id: user.id,
                        name: user.name
                    }
                    // res.status(200).json({data:"ok"});
                    next()
                }
                else { res.status(401).json({ status: false,message:"authentication failed" }) }
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
module.exports = { isAuthenticated };