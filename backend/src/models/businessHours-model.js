// models/businessHours-model.js
// Gestiona las consultas SQL relacionadas con los horarios del negocio.

import pool from "../config/database.js";

export async function getAllBusinessHours() {
  const [rows] = await pool.query(
    `SELECT
       id,
       day_of_week,
       open_time,
       close_time,
       is_open,
       has_break,
       break_start_time,
       break_end_time,
       created_at,
       updated_at
     FROM business_hours
     ORDER BY day_of_week ASC`
  );

  return rows;
}

export async function getBusinessHoursByDay(dayOfWeek) {
  const [rows] = await pool.query(
    `SELECT
       id,
       day_of_week,
       open_time,
       close_time,
       is_open,
       has_break,
       break_start_time,
       break_end_time,
       created_at,
       updated_at
     FROM business_hours
     WHERE day_of_week = ?
     LIMIT 1`,
    [dayOfWeek]
  );

  return rows[0] || null;
}

export async function updateBusinessHours(
  id,
  businessHoursData
) {
  const {
    open_time,
    close_time,
    is_open,
    has_break,
    break_start_time,
    break_end_time,
  } = businessHoursData;

  await pool.query(
    `UPDATE business_hours
     SET
       open_time = ?,
       close_time = ?,
       is_open = ?,
       has_break = ?,
       break_start_time = ?,
       break_end_time = ?
     WHERE id = ?`,
    [
      open_time,
      close_time,
      is_open,
      has_break,
      break_start_time,
      break_end_time,
      id,
    ]
  );

  const [rows] = await pool.query(
    `SELECT
       id,
       day_of_week,
       open_time,
       close_time,
       is_open,
       has_break,
       break_start_time,
       break_end_time,
       created_at,
       updated_at
     FROM business_hours
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}