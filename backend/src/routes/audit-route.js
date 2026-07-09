// routes/audit-route.js
// Define las rutas relacionadas con auditoria.

import { Router } from "express";

import { getAuditLogs } from "../controllers/audit-controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Lista los registros de auditoria.
router.get("/", authMiddleware, getAuditLogs);

export default router;