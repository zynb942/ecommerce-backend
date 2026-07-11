const nodemailer = require("nodemailer");
const _config = require("../config/env");

const transporter = nodemailer.createTransport({
  host: _config.EMAIL_HOST,
  port: _config.EMAIL_PORT,
  secure: _config.EMAIL_PORT === 465,
  auth: {
    user: _config.EMAIL_USER,
    pass: _config.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async ({ to, subject, html }) => {

try {
    await transporter.sendMail({
      from: `"E-Commerce Platform" <${_config.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw error;
  }
  
};

module.exports = sendEmail;