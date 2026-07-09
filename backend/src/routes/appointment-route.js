// routes/appointment-route.js
// Define las rutas relacionadas con las reservas.

import { Router } from "express";

import {
  createAppointment,
  getAppointment,
  getAppointmentStatsController,
  listAppointments,
  listAvailableSlots,
  updateAppointmentStatusController,
} from "../controllers/appointment-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { appointmentLimiter } from "../middlewares/rateLimit.js";
import { validateZod } from "../middlewares/validateZod.js";

import { availabilityQuerySchema } from "../schemas/availability.schema.js";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../schemas/appointment.schema.js";

const router = Router();

// Lista turnos disponibles.
router.get(
  "/availability",
  validateZod(
    availabilityQuerySchema,
    "query"
  ),
  listAvailableSlots
);

// Crea una nueva reserva desde el sitio publico.
router.post(
  "/",
  appointmentLimiter,
  validateZod(createAppointmentSchema),
  createAppointment
);

// Obtiene las estadisticas del dashboard.
router.get(
  "/stats",
  authMiddleware,
  getAppointmentStatsController
);

// Lista todas las reservas para administradores.
router.get(
  "/",
  authMiddleware,
  listAppointments
);

// Obtiene una reserva por ID.
router.get(
  "/:id",
  authMiddleware,
  getAppointment
);

// Actualiza el estado de una reserva.
router.patch(
  "/:id/status",
  authMiddleware,
  validateZod(updateAppointmentStatusSchema),
  updateAppointmentStatusController
);

export default router;