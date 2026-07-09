// config/mail.js
// Configura el transporte para el envio de correos.

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "localhost",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,

  auth:
    process.env.MAIL_USER && process.env.MAIL_PASSWORD
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        }
      : undefined,
});

export default transporter;