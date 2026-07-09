// routes/businessHours-route.js
// Define las rutas relacionadas con los horarios del negocio.

import { Router } from "express";

import {
  editBusinessHours,
  listBusinessHours,
} from "../controllers/businessHours-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateZod } from "../middlewares/validateZod.js";
import { updateBusinessHoursSchema } from "../schemas/businessHours.schema.js";

const router = Router();

// Lista los horarios del negocio.
router.get("/", listBusinessHours);

// Actualiza un horario del negocio.
router.put(
  "/:id",
  authMiddleware,
  validateZod(updateBusinessHoursSchema),
  editBusinessHours
);

export default router;