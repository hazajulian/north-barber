// routes/barber-route.js
// Define las rutas relacionadas con los barberos.

import { Router } from "express";

import {
  createNewBarber,
  deleteBarberPermanently,
  editBarber,
  getBarber,
  listAllBarbers,
  listBarbers,
  removeBarber,
  toggleBarber,
} from "../controllers/barber-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadBarberImage } from "../middlewares/upload.js";
import { validateZod } from "../middlewares/validateZod.js";

import {
  createBarberSchema,
  updateBarberSchema,
} from "../schemas/barber.schema.js";

const router = Router();

// Lista barberos activos para clientes.
router.get("/", listBarbers);

// Lista todos los barberos para administradores.
router.get("/admin", authMiddleware, listAllBarbers);

// Obtiene un barbero por ID.
router.get("/:id", getBarber);

// Crea un nuevo barbero.
router.post(
  "/",
  authMiddleware,
  uploadBarberImage.single("image"),
  validateZod(createBarberSchema),
  createNewBarber
);

// Actualiza un barbero existente.
router.put(
  "/:id",
  authMiddleware,
  uploadBarberImage.single("image"),
  validateZod(updateBarberSchema),
  editBarber
);

// Activa o desactiva un barbero.
router.patch(
  "/:id/toggle",
  authMiddleware,
  toggleBarber
);

// Elimina definitivamente un barbero.
router.delete(
  "/:id/permanent",
  authMiddleware,
  deleteBarberPermanently
);

// Compatibilidad con versiones anteriores.
router.delete(
  "/:id",
  authMiddleware,
  removeBarber
);

export default router;