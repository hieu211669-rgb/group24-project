// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // hoặc SMTP khác
      auth: {
        user: process.env.EMAIL_USER, // email của bạn
        pass: process.env.EMAIL_PASS  // password hoặc App Password
      }
    });

    // Tạo mailOptions
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;
