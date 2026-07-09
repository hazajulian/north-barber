// routes/dashboard-route.js
// Define las rutas del panel administrador.

import { Router } from "express";

import {
  getDashboard,
  getDashboardRevenueController,
} from "../controllers/dashboard-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Devuelve el resumen principal del panel administrador.
router.get("/", authMiddleware, getDashboard);

// Devuelve ingresos generales y por barbero.
router.get(
  "/revenue",
  authMiddleware,
  getDashboardRevenueController
);

export default router;