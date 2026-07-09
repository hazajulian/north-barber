// routes/auth-route.js
// Define las rutas de autenticacion del administrador.

import { Router } from "express";

import {
  forgotPassword,
  login,
  me,
  resetUserPassword,
  updateEmail,
  updatePassword,
} from "../controllers/auth-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  changeEmailSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";

import { loginLimiter } from "../middlewares/rateLimit.js";
import { validateZod } from "../middlewares/validateZod.js";

const router = Router();

// Inicia sesion como administrador.
router.post(
  "/login",
  loginLimiter,
  validateZod(loginSchema),
  login
);

// Devuelve la informacion del usuario autenticado.
router.get(
  "/me",
  authMiddleware,
  me
);

// Permite actualizar el correo del administrador.
router.patch(
  "/email",
  authMiddleware,
  validateZod(changeEmailSchema),
  updateEmail
);

// Permite cambiar la contraseña.
router.patch(
  "/change-password",
  authMiddleware,
  validateZod(changePasswordSchema),
  updatePassword
);

// Solicita un enlace para recuperar contraseña.
router.post(
  "/forgot-password",
  validateZod(forgotPasswordSchema),
  forgotPassword
);

// Restablece la contraseña usando un token temporal.
router.post(
  "/reset-password",
  validateZod(resetPasswordSchema),
  resetUserPassword
);

export default router;