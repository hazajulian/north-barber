// routes/service-route.js
// Define las rutas relacionadas con los servicios de barberia.

import { Router } from "express";

import {
  createNewService,
  editService,
  getService,
  listAllServices,
  listServices,
  removeService,
} from "../controllers/service-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateZod } from "../middlewares/validateZod.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../schemas/service.schema.js";

const router = Router();

// Lista servicios activos para clientes.
router.get("/", listServices);

// Lista todos los servicios para administradores.
router.get("/admin", authMiddleware, listAllServices);

// Obtiene un servicio por ID.
router.get("/:id", getService);

// Crea un nuevo servicio.
router.post("/", authMiddleware, validateZod(createServiceSchema), createNewService);

// Actualiza un servicio existente.
router.put("/:id", authMiddleware, validateZod(updateServiceSchema), editService);

// Desactiva un servicio.
router.delete("/:id", authMiddleware, removeService);

export default router;