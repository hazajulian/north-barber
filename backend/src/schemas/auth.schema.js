// schemas/auth.schema.js
// Define las validaciones para autenticacion del administrador.

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must have at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must have at least 6 characters"),

  newPassword: z
    .string()
    .min(8, "New password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .email("Invalid email format"),

  currentPassword: z
    .string()
    .min(6, "Current password must have at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(10, "Reset token is required"),

  newPassword: z
    .string()
    .min(8, "New password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});