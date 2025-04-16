// backend/src/utils/emailService.js
const nodemailer = require('nodemailer');

/**
 * Configuration for different environments
 */
const config = {
  development: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER || 'your-mailtrap-user',
      pass: process.env.MAILTRAP_PASS || 'your-mailtrap-password'
    }
  },
  production: {
    service: process.env.EMAIL_SERVICE || 'SendGrid',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Nodemailer send result
 */
async function sendEmail({ to, subject, text, html }) {
  const env = process.env.NODE_ENV || 'development';
  const transportConfig = config[env];
  
  // Create transporter
  const transporter = nodemailer.createTransport(transportConfig);
  
  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@equestrianmarketplace.com',
    to,
    subject,
    text,
    html
  };
  
  // Send email
  return await transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail
};