// models/user-model.js
// Gestiona las consultas SQL relacionadas con usuarios administradores.

import pool from "../config/database.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function updateUserPassword(id, password) {
  await pool.query(
    `
      UPDATE users
      SET password = ?
      WHERE id = ?
    `,
    [password, id]
  );

  return findUserById(id);
}

export async function updateUserEmail(id, email) {
  await pool.query(
    `
      UPDATE users
      SET email = ?
      WHERE id = ?
    `,
    [email, id]
  );

  return findUserById(id);
}