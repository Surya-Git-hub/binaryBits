// const { v4: uuid } = require("uuid");
// const user = require("../database/user");
const { Prisma, PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
require('dotenv').config()

const prisma = new PrismaClient();

const getAllUsers = () => {
  const allusers = prisma.user.findMany();
  return allusers;
};

// const getOneuser = () => {
//   return;
// };
async function checkDuplicateEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user !== null;
}
const generateVerificationLink = (email, userId) => {
  const secret = process.env.CSEC;
  const cryptr = new Cryptr(secret);
  const encryptedToken = cryptr.encrypt(email + " " + userId);
  const verificationLink = `${process.env.BASE_URL}/verify?token=${encryptedToken}`;
  console.log("verificationlink>>>", verificationLink);
  return verificationLink;
};

const verifyEmail = async (email, name, vlink) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EPASS
      }
    });
    let template = `<html>
  <head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
  </head>
  <body>
    <div style="text-align: center;">
      <h2>Email Verification</h2>
      <p>Hello, {{name}}!</p>
      <p>Thank you for registering! Please click the link below to verify your email address:</p>
      <p>
        <a href="{{verification_link}}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
      </p>
      <p>If you didn't sign up for this account, you can safely ignore this email.</p>
    </div>
  </body>
  </html>`
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email verification for Binary bits',
      text: 'That was easy!',
      html: template.replace('{{verification_link}}', vlink).replace('{{name}}', name)
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return "email has been sent for account verification"
  } catch (error) {
    console.error('Error sending email:', error);
    return error
  }
}

const createNewUser = async (req, res) => {
  let { name, password, email } = req.body;
  if (await checkDuplicateEmail(email)) {
    return res.status(400).json({ error: 'email already exist' });
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userToInsert = {
    name, pass:hashedPassword, email,
    emailVerified: false,
  };
  const createdUser = await prisma.user.create({ data: userToInsert });
  // let vlink = generateVerificationLink(createdUser.id, email, name);
  // let verificaton = verifyEmail(email, name, vlink);
  res.status(201).send({ status: "OK", data: createdUser });
};



// const updateOneuser = () => {
//   return;
// };

// const deleteOneuser = () => {
//   return;
// };

module.exports = {
  getAllUsers,
  // getOneuser,
  createNewUser,
  // updateOneuser,
  // deleteOneuser,
};