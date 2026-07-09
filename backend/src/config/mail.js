// config/mail.js
// Configura el transporte para el envio de correos.

import nodemailer from "nodemailer";

const MAIL_PORT = Number(process.env.MAIL_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_PORT === 465,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },

  requireTLS: MAIL_PORT === 587,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export default transporter;