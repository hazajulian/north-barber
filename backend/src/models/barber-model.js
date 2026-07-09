// models/barber-model.js
// Gestiona las consultas SQL relacionadas con los barberos.

import pool from "../config/database.js";

export async function getAllBarbers() {
  const [rows] = await pool.query(
    "SELECT * FROM barbers ORDER BY name ASC"
  );

  return rows;
}

export async function getActiveBarbers() {
  const [rows] = await pool.query(
    "SELECT * FROM barbers WHERE is_active = TRUE ORDER BY name ASC"
  );

  return rows;
}

export async function getBarberById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM barbers WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
}

export async function createBarber(barberData) {
  const {
    name,
    specialty,
    bio,
    email,
    phone,
    image_url,
  } = barberData;

  const [result] = await pool.query(
    `
      INSERT INTO barbers
      (
        name,
        specialty,
        bio,
        email,
        phone,
        image_url,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, TRUE)
    `,
    [
      name,
      specialty,
      bio,
      email || null,
      phone || null,
      image_url,
    ]
  );

  return getBarberById(result.insertId);
}

export async function updateBarber(
  id,
  barberData
) {
  const {
    name,
    specialty,
    bio,
    email,
    phone,
    image_url,
    is_active,
  } = barberData;

  await pool.query(
    `
      UPDATE barbers
      SET
        name = ?,
        specialty = ?,
        bio = ?,
        email = ?,
        phone = ?,
        image_url = ?,
        is_active = ?
      WHERE id = ?
    `,
    [
      name,
      specialty,
      bio,
      email || null,
      phone || null,
      image_url,
      is_active ? 1 : 0,
      id,
    ]
  );

  return getBarberById(id);
}

export async function updateAppointmentsBarberSnapshot(
  barberId,
  barberName
) {
  await pool.query(
    `
      UPDATE appointments
      SET barber_name_snapshot = ?
      WHERE barber_id = ?
    `,
    [
      barberName,
      barberId,
    ]
  );
}

export async function toggleBarber(id) {
  await pool.query(
    `
      UPDATE barbers
      SET is_active = NOT is_active
      WHERE id = ?
    `,
    [id]
  );

  return getBarberById(id);
}

export async function countActiveBarberAppointments(id) {
  const [rows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM appointments
      WHERE barber_id = ?
      AND status IN ('pending', 'confirmed')
    `,
    [id]
  );

  return Number(rows[0].total);
}

export async function deleteBarberPermanently(
  id
) {
  const barber =
    await getBarberById(id);

  await pool.query(
    `
      DELETE FROM barbers
      WHERE id = ?
    `,
    [id]
  );

  return barber;
}

export async function deleteBarber(id) {
  await pool.query(
    `
      UPDATE barbers
      SET is_active = FALSE
      WHERE id = ?
    `,
    [id]
  );

  return getBarberById(id);
}