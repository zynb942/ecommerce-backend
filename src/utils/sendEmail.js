const nodemailer = require("nodemailer");
const _config = require("../config/env");

// Function to send email
const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
    host: _config.EMAIL_HOST,
    port: _config.EMAIL_PORT,
    secure: _config.EMAIL_PORT === 465, 
    auth: {
      user: _config.EMAIL_USER,
      pass: _config.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: `"E-Commerce Platform" <${_config.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html 
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;