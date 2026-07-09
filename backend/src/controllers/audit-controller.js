// controllers/audit-controller.js
// Controla las peticiones relacionadas con auditoria.

import { listAuditLogs } from "../services/audit-service.js";
import { sendSuccess } from "../utils/response.js";

export async function getAuditLogs(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 100;

    const logs = await listAuditLogs(limit);

    return sendSuccess(
      res,
      "Audit logs retrieved successfully",
      logs
    );
  } catch (error) {
    next(error);
  }
}