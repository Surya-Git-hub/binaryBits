const { Prisma, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { checkDuplicateEmail } = require("../utils/checkDuplicateEmail");
const { comparePasswords } = require("../utils/comparePasswords");
const { createJWT } = require("../utils/createJWT");
const { generateVerificationLink } = require("../utils/generateVerificationLink");
const { verifyMail } = require("../utils/verifyMail");

const register = async (req, res) => {
    try {
        let { name, password, email } = req.body;
        if (await checkDuplicateEmail(email)) {
            return res.status(400).json({ error: "email already exist" });
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userToInsert = {
            name,
            pass: hashedPassword,
            email,
            emailVerified: false,
        };
        const createdUser = await prisma.User.create({ data: userToInsert });
        let vlink = await generateVerificationLink(email, createdUser.id);
        let verificaton = await verifyMail(email, name, vlink);
        const token = await createJWT(createdUser.id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        return res.status(201).json({
            message: "User signed in successfully",
            success: true,
            createdUser,
            emaiVerification: verificaton,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        if (!comparePasswords(password, user.pass)) {
            return res.status(401).json({ message: "Incorrect password or email" });
        }
        const token = await createJWT(user.id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            sameSite: "lax",
        });
        if (user.profile) {
            return res.status(200).json({
                message: "User logged in successfully",
                success: true,
                token,
                userData: {
                    user: user.name,
                    email: user.email,
                    profileComplete: true,
                },
            });
        } else {
            return res.status(200).json({
                message: "User logged in successfully",
                success: true,
                token,
                userData: {
                    user: user.name,
                    email: user.email,
                    profileComplete: false,
                },
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error" });
    }
};

const sendRegisterlink = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await checkDuplicateEmail(email);
        if (!user) {
            const userToInsert = {
                email,
                emailVerified: false,
            };
            user = await prisma.User.create({ data: userToInsert });
        }
        const token = await createJWT(user.id);
        let name = "user"
        let verificaton = await verifyMail(email, name, token);
        return res.status(201).json({
            message: "Token sent successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error" });
    }
}

const verifyToken = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(401).json({ status: false })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                res.status(401).json({ status: false })
            } else {
                const user = await prisma.User.findUnique({
                    where: {
                        id: data.id
                    }
                });
                if (user) {
                    if (user.emailVerified && user.hasProfile) {
                        res.cookie("token", token, {
                            withCredentials: true,
                            httpOnly: false,
                            sameSite: "lax",
                        });

                        res.redirect("/home")

                    } else if (user.emailVerified && !user.hasProfile) {
                        res.cookie("token", token, {
                            withCredentials: true,
                            httpOnly: false,
                            sameSite: "lax",
                        });

                        res.redirect("/create-profile");

                    } else if (!user.emailVerified) {
                        res.cookie("token", token, {
                            withCredentials: true,
                            httpOnly: false,
                            sameSite: "lax",
                        });
                        updatedUser = await prisma.user.update({
                            where: {
                                id: user.id,
                            },
                            data: {
                                emailVerified: true,
                            },
                        });
                        res.redirect("/create-profile")
                    }
                }
                else { res.status(401).json({ status: false, message: "authentication failed" }) }
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


module.exports = {
    register,
    login,
    sendRegisterlink,
    verifyToken
}