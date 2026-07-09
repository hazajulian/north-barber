// utils/token.js
// Centraliza la creacion y verificacion de tokens JWT.

import jwt from "jsonwebtoken";

export function generateResetPasswordToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      purpose: "reset-password",
    },
    process.env.JWT_RESET_SECRET,
    {
      expiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m",
    }
  );
}

export function verifyResetPasswordToken(token) {
  return jwt.verify(token, process.env.JWT_RESET_SECRET);
}