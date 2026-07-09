// routes/notification-route.js
// Define las rutas relacionadas con notificaciones internas.

import { Router } from "express";

import {
  listNotifications,
  listUnreadNotifications,
  readAllNotifications,
  readNotification,
  removeNotification,
} from "../controllers/notification-controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Lista todas las notificaciones.
router.get(
  "/",
  authMiddleware,
  listNotifications
);

// Lista notificaciones no leidas.
router.get(
  "/unread",
  authMiddleware,
  listUnreadNotifications
);

// Marca todas las notificaciones como leidas.
router.patch(
  "/read-all",
  authMiddleware,
  readAllNotifications
);

// Marca una notificacion como leida.
router.patch(
  "/:id/read",
  authMiddleware,
  readNotification
);

// Elimina una notificacion.
router.delete(
  "/:id",
  authMiddleware,
  removeNotification
);

export default router;