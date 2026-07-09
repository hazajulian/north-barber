// models/appointment-model.js
// Gestiona las consultas SQL relacionadas con las reservas.

import pool from "../config/database.js";

export async function getAllAppointments() {
  const [rows] = await pool.query(
    `SELECT 
      appointments.*,
      COALESCE(
        appointments.barber_name_snapshot,
        barbers.name,
        'Barbero eliminado'
      ) AS barber_name,
      services.name AS service_name,
      services.duration_minutes,
      services.price
     FROM appointments
     LEFT JOIN barbers ON appointments.barber_id = barbers.id
     INNER JOIN services ON appointments.service_id = services.id
     ORDER BY appointments.appointment_date DESC, appointments.start_time DESC`
  );

  return rows;
}

export async function getAppointmentById(id) {
  const [rows] = await pool.query(
    `SELECT 
      appointments.*,
      COALESCE(
        appointments.barber_name_snapshot,
        barbers.name,
        'Barbero eliminado'
      ) AS barber_name,
      services.name AS service_name,
      services.duration_minutes,
      services.price
     FROM appointments
     LEFT JOIN barbers ON appointments.barber_id = barbers.id
     INNER JOIN services ON appointments.service_id = services.id
     WHERE appointments.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function getAppointmentsByBarberAndDate(
  barberId,
  appointmentDate
) {
  const [rows] = await pool.query(
    `SELECT *
     FROM appointments
     WHERE barber_id = ?
     AND appointment_date = ?
     AND status IN ('pending', 'confirmed')
     ORDER BY start_time ASC`,
    [barberId, appointmentDate]
  );

  return rows;
}

export async function getAppointmentStats() {
  const [[stats]] = await pool.query(
    `SELECT
      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_date = CURDATE()
        AND status IN ('pending', 'confirmed')
      ) AS today,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_date >= CURDATE()
        AND status IN ('pending', 'confirmed')
      ) AS upcoming,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status = 'completed'
        AND YEAR(appointment_date) = YEAR(CURDATE())
        AND MONTH(appointment_date) = MONTH(CURDATE())
      ) AS completedMonth,

      (
        SELECT COALESCE(SUM(services.price), 0)
        FROM appointments
        INNER JOIN services
          ON services.id = appointments.service_id
        WHERE appointments.status = 'completed'
        AND YEAR(appointments.appointment_date) = YEAR(CURDATE())
        AND MONTH(appointments.appointment_date) = MONTH(CURDATE())
      ) AS revenueMonth`
  );

  return {
    today: Number(stats.today) || 0,
    upcoming: Number(stats.upcoming) || 0,
    completedMonth: Number(stats.completedMonth) || 0,
    revenueMonth: Number(stats.revenueMonth) || 0,
  };
}

export async function countAppointmentsByServiceId(serviceId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM appointments
     WHERE service_id = ?`,
    [serviceId]
  );

  return rows[0]?.total || 0;
}

export async function createAppointment(appointmentData) {
  const {
    barber_id,
    service_id,
    customer_name,
    customer_email,
    customer_phone,
    appointment_date,
    start_time,
    end_time,
    notes,
  } = appointmentData;

  const [barberRows] = await pool.query(
    `SELECT name
     FROM barbers
     WHERE id = ?
     LIMIT 1`,
    [barber_id]
  );

  const barberNameSnapshot =
    barberRows[0]?.name || "Barbero eliminado";

  const [result] = await pool.query(
    `INSERT INTO appointments (
      barber_id,
      service_id,
      barber_name_snapshot,
      customer_name,
      customer_email,
      customer_phone,
      appointment_date,
      start_time,
      end_time,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      barber_id,
      service_id,
      barberNameSnapshot,
      customer_name,
      customer_email,
      customer_phone,
      appointment_date,
      start_time,
      end_time,
      notes,
    ]
  );

  return getAppointmentById(result.insertId);
}

export async function updateAppointmentStatus(id, status) {
  await pool.query(
    `UPDATE appointments 
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return getAppointmentById(id);
}