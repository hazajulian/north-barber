// models/service-model.js
// Gestiona las consultas SQL relacionadas con los servicios.

import pool from "../config/database.js";

export async function getAllServices() {
  const [rows] = await pool.query(
    "SELECT * FROM services ORDER BY duration_minutes ASC, price ASC"
  );

  return rows;
}

export async function getActiveServices() {
  const [rows] = await pool.query(
    "SELECT * FROM services WHERE is_active = TRUE ORDER BY duration_minutes ASC, price ASC"
  );

  return rows;
}

export async function getServiceById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM services WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
}

export async function createService(serviceData) {
  const { name, description, duration_minutes, price } = serviceData;

  const [result] = await pool.query(
    `INSERT INTO services (name, description, duration_minutes, price)
     VALUES (?, ?, ?, ?)`,
    [name, description, duration_minutes, price]
  );

  return getServiceById(result.insertId);
}

export async function updateService(id, serviceData) {
  const {
    name,
    description,
    duration_minutes,
    price,
    is_active,
  } = serviceData;

  await pool.query(
    `UPDATE services
     SET name = ?, description = ?, duration_minutes = ?, price = ?, is_active = ?
     WHERE id = ?`,
    [name, description, duration_minutes, price, is_active, id]
  );

  return getServiceById(id);
}

export async function deleteService(id) {
  await pool.query(
    "DELETE FROM services WHERE id = ?",
    [id]
  );

  return true;
}