// services/audit-service.js
// Gestiona la logica relacionada con auditoria.

import {
  createAuditLog,
  getAllAuditLogs,
} from "../models/audit-model.js";

export async function listAuditLogs(limit) {
  return getAllAuditLogs(limit);
}

export async function registerAuditLog({
  userId = null,
  action,
  entity,
  entityId = null,
  description,
}) {
  try {
    return await createAuditLog({
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      description,
    });
  } catch (error) {
    console.error("Failed to create audit log.");
    console.error(error.message);

    return null;
  }
}