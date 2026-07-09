// services/mail-service.js
// Gestiona el envio de correos de la aplicacion.

import transporter from "../config/mail.js";

const FROM_EMAIL = process.env.MAIL_FROM || process.env.MAIL_USER;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const MAIL_ENABLED = process.env.MAIL_ENABLED === "true";

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(time) {
  return String(time).slice(0, 5);
}

function formatDateTime(date = new Date()) {
  return new Date(date).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Envia un correo o imprime el contenido en consola si el envio esta deshabilitado.
async function sendMail(mailOptions) {
  if (!MAIL_ENABLED) {
    console.log("\n========================================");
    console.log(" NORTH BARBER - DEV MAIL");
    console.log("========================================");
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(mailOptions.html);
    console.log("========================================\n");

    return;
  }

  await transporter.sendMail(mailOptions);
}

export async function sendAppointmentConfirmationEmail(appointment) {
  if (!appointment.customer_email) return;

  await sendMail({
    from: FROM_EMAIL,
    to: appointment.customer_email,
    subject: "North Barber - Appointment received",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${appointment.customer_name}, your appointment request was received.</p>

      <p><strong>Date:</strong> ${formatDate(appointment.appointment_date)}</p>

      <p><strong>Time:</strong> ${formatTime(appointment.start_time)}</p>

      <p><strong>Service:</strong> ${appointment.service_name}</p>

      <p><strong>Barber:</strong> ${appointment.barber_name}</p>

      <p>We will contact you if there are any changes.</p>
    `,
  });
}

export async function sendAppointmentStatusEmail(appointment) {
  if (!appointment.customer_email) return;

  const statusLabels = {
    pending: "pending",
    confirmed: "confirmed",
    cancelled: "cancelled",
    completed: "completed",
  };

  await sendMail({
    from: FROM_EMAIL,
    to: appointment.customer_email,
    subject: `North Barber - Appointment ${statusLabels[appointment.status]}`,
    html: `
      <h2>North Barber</h2>

      <p>Hi ${appointment.customer_name}, your appointment status is now:</p>

      <p><strong>${statusLabels[appointment.status]}</strong></p>

      <p><strong>Date:</strong> ${formatDate(appointment.appointment_date)}</p>

      <p><strong>Time:</strong> ${formatTime(appointment.start_time)}</p>

      <p><strong>Service:</strong> ${appointment.service_name}</p>

      <p><strong>Barber:</strong> ${appointment.barber_name}</p>
    `,
  });
}

export async function sendAppointmentCancellationEmail(
  appointment,
  options = {}
) {
  if (!appointment.customer_email) return;

  if (options.sendEmail === false) return;

  const defaultMessage =
    "Your appointment has been cancelled. If you have any questions or want to schedule a new appointment, please contact North Barber.";

  const finalMessage =
    options.customMessage?.trim() || defaultMessage;

  await sendMail({
    from: FROM_EMAIL,
    to: appointment.customer_email,
    subject: "North Barber - Appointment cancelled",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${appointment.customer_name},</p>

      <p>${finalMessage}</p>

      <p><strong>Cancelled appointment details:</strong></p>

      <p><strong>Date:</strong> ${formatDate(appointment.appointment_date)}</p>

      <p><strong>Time:</strong> ${formatTime(appointment.start_time)}</p>

      <p><strong>Service:</strong> ${appointment.service_name}</p>

      <p><strong>Barber:</strong> ${appointment.barber_name}</p>

      <p>North Barber</p>
    `,
  });
}

export async function sendResetPasswordEmail(user, token) {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "North Barber - Reset your password",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${user.name}, we received a request to reset your password.</p>

      <p>Click the link below to create a new password:</p>

      <p>
        <a href="${resetUrl}">
          ${resetUrl}
        </a>
      </p>

      <p>This link will expire in 15 minutes.</p>

      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}

export async function sendLoginAlertEmail(user, details = {}) {
  if (!user?.email) return;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "North Barber - New admin login",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${user.name}, a new login was detected in your admin panel.</p>

      <p><strong>Date:</strong> ${formatDateTime()}</p>

      <p><strong>IP:</strong> ${details.ip || "Not available"}</p>

      <p><strong>Device:</strong> ${details.userAgent || "Not available"}</p>

      <p>If this was you, no action is needed.</p>

      <p>If this was not you, change your password immediately.</p>
    `,
  });
}

export async function sendEmailChangedToOldEmail(user, newEmail) {
  if (!user?.email) return;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "North Barber - Admin email changed",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${user.name}, your admin access email was changed.</p>

      <p><strong>Previous email:</strong> ${user.email}</p>

      <p><strong>New email:</strong> ${newEmail}</p>

      <p><strong>Date:</strong> ${formatDateTime()}</p>

      <p>If this was you, no action is needed.</p>

      <p>If this was not you, contact support and reset your password immediately.</p>
    `,
  });
}

export async function sendEmailChangedToNewEmail(user, oldEmail) {
  if (!user?.email) return;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "North Barber - This is now your admin email",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${user.name}, this email is now used to access your admin panel.</p>

      <p><strong>Previous email:</strong> ${oldEmail}</p>

      <p><strong>New email:</strong> ${user.email}</p>

      <p><strong>Date:</strong> ${formatDateTime()}</p>

      <p>You can use this email to log in and recover your account.</p>
    `,
  });
}

export async function sendPasswordChangedEmail(user) {
  if (!user?.email) return;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "North Barber - Password changed",
    html: `
      <h2>North Barber</h2>

      <p>Hi ${user.name}, your admin password was changed successfully.</p>

      <p><strong>Date:</strong> ${formatDateTime()}</p>

      <p>If this was you, no action is needed.</p>

      <p>If this was not you, request a password reset immediately.</p>
    `,
  });
}