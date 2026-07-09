// rateLimit.js
// Limita la cantidad de peticiones para evitar abusos.

import rateLimit from "express-rate-limit";

// Limita los intentos de inicio de sesion.
const defaultOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
};

export const loginLimiter = rateLimit({
  ...defaultOptions,

  max: 5,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});


// Limita la creacion de reservas.
export const appointmentLimiter = rateLimit({
  ...defaultOptions,

  max: 20,

  message: {
    success: false,
    message: "Too many appointment requests. Please try again later.",
  },
});