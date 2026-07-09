// models/audit-model.js
// Gestiona las consultas SQL relacionadas con auditoria.

import pool from "../config/database.js";

export async function createAuditLog(auditData) {
  const {
    user_id,
    action,
    entity,
    entity_id,
    description,
  } = auditData;

  const [result] = await pool.query(
    `
      INSERT INTO audit_logs
      (user_id, action, entity, entity_id, description)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      user_id || null,
      action,
      entity,
      entity_id || null,
      description,
    ]
  );

  return getAuditLogById(result.insertId);
}

export async function getAuditLogById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        audit_logs.*,
        users.name AS user_name,
        users.email AS user_email
      FROM audit_logs
      LEFT JOIN users ON audit_logs.user_id = users.id
      WHERE audit_logs.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function getAllAuditLogs(limit = 100) {
  const [rows] = await pool.query(
    `
      SELECT
        audit_logs.*,
        users.name AS user_name,
        users.email AS user_email
      FROM audit_logs
      LEFT JOIN users ON audit_logs.user_id = users.id
      ORDER BY audit_logs.created_at DESC
      LIMIT ?
    `,
    [limit]
  );

  return rows;
}