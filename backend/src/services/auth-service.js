// services/auth-service.js
// Gestiona la logica de autenticacion del administrador.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  findUserById,
  updateUserEmail,
  updateUserPassword,
} from "../models/user-model.js";

import { registerAuditLog } from "./audit-service.js";

import {
  sendEmailChangedToNewEmail,
  sendEmailChangedToOldEmail,
  sendLoginAlertEmail,
  sendPasswordChangedEmail,
  sendResetPasswordEmail,
} from "./mail-service.js";

import {
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from "../utils/token.js";

async function safeSendMail(callback) {
  try {
    await callback();
  } catch (error) {
    console.error(
      "Mail service error:",
      error.message
    );
  }
}

export async function loginAdmin(
  email,
  password,
  details = {}
) {
  const user = await findUserByEmail(email);

  if (!user || !user.is_active) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  await registerAuditLog({
    userId: user.id,
    action: "login",
    entity: "auth",
    entityId: user.id,
    description: `El administrador ${user.email} inicio sesion.`,
  });

  await safeSendMail(() =>
    sendLoginAlertEmail(user, details)
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

export async function getAuthenticatedUser(id) {
  const user = await findUserById(id);

  if (!user || !user.is_active) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

export async function changeEmail(
  userId,
  newEmail,
  currentPassword
) {
  const publicUser = await findUserById(userId);

  if (!publicUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findUserByEmail(
    publicUser.email
  );

  if (!user || !user.is_active) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail =
    newEmail.trim().toLowerCase();

  if (normalizedEmail === user.email) {
    return {
      message: "Email updated successfully",
      user: publicUser,
    };
  }

  const existingUser =
    await findUserByEmail(normalizedEmail);

  if (existingUser && existingUser.id !== userId) {
    const error = new Error("Email is already in use");
    error.statusCode = 409;
    throw error;
  }

  const oldEmail = user.email;

  const updatedUser = await updateUserEmail(
    userId,
    normalizedEmail
  );

  await registerAuditLog({
    userId,
    action: "change_email",
    entity: "auth",
    entityId: userId,
    description: `El administrador cambio su correo de ${oldEmail} a ${normalizedEmail}.`,
  });

  await safeSendMail(() =>
    sendEmailChangedToOldEmail(
      user,
      normalizedEmail
    )
  );

  await safeSendMail(() =>
    sendEmailChangedToNewEmail(
      updatedUser,
      oldEmail
    )
  );

  return {
    message: "Email updated successfully",
    user: updatedUser,
  };
}

export async function changePassword(
  userId,
  currentPassword,
  newPassword
) {
  const publicUser = await findUserById(userId);

  if (!publicUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findUserByEmail(
    publicUser.email
  );

  if (!user || !user.is_active) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await updateUserPassword(
    userId,
    hashedPassword
  );

  await registerAuditLog({
    userId,
    action: "change_password",
    entity: "auth",
    entityId: userId,
    description: `El administrador ${user.email} cambio su contraseña.`,
  });

  await safeSendMail(() =>
    sendPasswordChangedEmail(user)
  );

  return {
    message: "Password updated successfully",
  };
}

export async function requestPasswordReset(email) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await findUserByEmail(normalizedEmail);

  if (!user || !user.is_active) {
    return {
      message:
        "If the email exists, a reset link has been sent.",
    };
  }

  const token =
    generateResetPasswordToken(user);

  await safeSendMail(() =>
    sendResetPasswordEmail(user, token)
  );

  await registerAuditLog({
    userId: user.id,
    action: "forgot_password",
    entity: "auth",
    entityId: user.id,
    description: `Se solicito recuperacion de contraseña para ${user.email}.`,
  });

  return {
    message:
      "If the email exists, a reset link has been sent.",
  };
}

export async function resetPassword(
  token,
  newPassword
) {
  let decoded;

  try {
    decoded = verifyResetPasswordToken(token);
  } catch {
    const error = new Error(
      "Invalid or expired reset token"
    );
    error.statusCode = 401;
    throw error;
  }

  if (decoded.purpose !== "reset-password") {
    const error = new Error("Invalid reset token");
    error.statusCode = 401;
    throw error;
  }

  const publicUser =
    await findUserById(decoded.id);

  if (!publicUser || !publicUser.is_active) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await findUserByEmail(
    publicUser.email
  );

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await updateUserPassword(
    publicUser.id,
    hashedPassword
  );

  await registerAuditLog({
    userId: publicUser.id,
    action: "reset_password",
    entity: "auth",
    entityId: publicUser.id,
    description: `El administrador ${publicUser.email} restablecio su contraseña.`,
  });

  await safeSendMail(() =>
    sendPasswordChangedEmail(user || publicUser)
  );

  return {
    message: "Password reset successfully",
  };
}