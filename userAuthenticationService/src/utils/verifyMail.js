
const nodemailer = require("nodemailer")

require('dotenv').config()

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

module.exports = { verifyEmail };