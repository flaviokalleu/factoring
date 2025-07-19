// utils/sendNotification.js
// Exemplo: integração com e-mail (nodemailer) e SMS (Twilio)
const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Se quiser SMS

async function sendEmailNotification(to, subject, message) {
  // Configure o transporter com suas credenciais
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message
  });
}

module.exports = { sendEmailNotification };
