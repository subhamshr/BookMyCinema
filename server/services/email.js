const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = async ({ email, subject, html }) => {
  const { messageId } = await transporter.sendMail({
    from: '"Subham Shrestha" <subham.shrestha13@gmail.com>', 
    to: email, 
    subject,
    html,
  });
};

module.exports = { sendMail };
