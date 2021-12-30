const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail({ emailFrom, emailTo, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    console.log(html)
    let info = await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: subject,
        text: text,
        html: html,
    });
}


module.exports = sendMail;