// models/dashboard-model.js
// Gestiona las consultas SQL para el resumen del panel administrador.

import pool from "../config/database.js";

function getPeriodCondition(period) {
  if (period === "day") {
    return "appointments.appointment_date = CURDATE()";
  }

  if (period === "week") {
    return `
      appointments.appointment_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
      AND appointments.appointment_date <= DATE_ADD(
        DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY),
        INTERVAL 6 DAY
      )
    `;
  }

  return `
    YEAR(appointments.appointment_date) = YEAR(CURDATE())
    AND MONTH(appointments.appointment_date) = MONTH(CURDATE())
  `;
}

export async function getDashboardStats() {
  const [[stats]] = await pool.query(`
    SELECT
      (
        SELECT COUNT(*)
        FROM appointments
        WHERE appointment_date = CURDATE()
      ) AS appointmentsToday,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status = 'pending'
      ) AS pendingAppointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status = 'confirmed'
      ) AS confirmedAppointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status = 'completed'
      ) AS completedAppointments,

      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status = 'cancelled'
      ) AS cancelledAppointments,

      (
        SELECT COUNT(*)
        FROM barbers
        WHERE is_active = TRUE
      ) AS activeBarbers,

      (
        SELECT COUNT(*)
        FROM services
        WHERE is_active = TRUE
      ) AS activeServices,

      (
        SELECT COUNT(*)
        FROM notifications
        WHERE is_read = FALSE
      ) AS unreadNotifications
  `);

  return {
    appointmentsToday: Number(stats.appointmentsToday) || 0,
    pendingAppointments: Number(stats.pendingAppointments) || 0,
    confirmedAppointments: Number(stats.confirmedAppointments) || 0,
    completedAppointments: Number(stats.completedAppointments) || 0,
    cancelledAppointments: Number(stats.cancelledAppointments) || 0,
    activeBarbers: Number(stats.activeBarbers) || 0,
    activeServices: Number(stats.activeServices) || 0,
    unreadNotifications: Number(stats.unreadNotifications) || 0,
  };
}

export async function getDashboardRevenue(period = "month") {
  const safePeriod = ["day", "week", "month"].includes(period)
    ? period
    : "month";

  const periodCondition = getPeriodCondition(safePeriod);

  const [[summary]] = await pool.query(`
    SELECT
      COALESCE(SUM(services.price), 0) AS totalRevenue,
      COUNT(appointments.id) AS completedAppointments,
      COALESCE(AVG(services.price), 0) AS averageTicket
    FROM appointments
    INNER JOIN services
      ON services.id = appointments.service_id
    WHERE appointments.status = 'completed'
    AND ${periodCondition}
  `);

  const [revenueByBarber] = await pool.query(`
    SELECT
      appointments.barber_id AS barberId,
      COALESCE(
        appointments.barber_name_snapshot,
        barbers.name,
        'Barbero eliminado'
      ) AS barberName,
      COALESCE(SUM(services.price), 0) AS totalRevenue,
      COUNT(appointments.id) AS completedAppointments
    FROM appointments
    LEFT JOIN barbers
      ON barbers.id = appointments.barber_id
    INNER JOIN services
      ON services.id = appointments.service_id
    WHERE appointments.status = 'completed'
    AND ${periodCondition}
    GROUP BY
      appointments.barber_id,
      barberName
    ORDER BY totalRevenue DESC
  `);

  const totalRevenue =
    Number(summary.totalRevenue) || 0;

  const completedAppointments =
    Number(summary.completedAppointments) || 0;

  return {
    period: safePeriod,
    totalRevenue,
    completedAppointments,
    averageTicket:
      completedAppointments > 0
        ? Math.round(totalRevenue / completedAppointments)
        : 0,
    revenueByBarber: revenueByBarber.map((barber) => ({
      barberId: barber.barberId,
      barberName: barber.barberName,
      totalRevenue: Number(barber.totalRevenue) || 0,
      completedAppointments:
        Number(barber.completedAppointments) || 0,
    })),
  };
}

export async function getUpcomingAppointments(limit = 5) {
  const [rows] = await pool.query(
    `
      SELECT
        appointments.id,
        appointments.customer_name,
        appointments.customer_email,
        appointments.customer_phone,
        appointments.appointment_date,
        appointments.start_time,
        appointments.end_time,
        appointments.status,
        COALESCE(
          appointments.barber_name_snapshot,
          barbers.name,
          'Barbero eliminado'
        ) AS barber_name,
        services.name AS service_name,
        services.price
      FROM appointments
      LEFT JOIN barbers ON appointments.barber_id = barbers.id
      INNER JOIN services ON appointments.service_id = services.id
      WHERE appointments.appointment_date >= CURDATE()
      AND appointments.status IN ('pending', 'confirmed')
      ORDER BY appointments.appointment_date ASC, appointments.start_time ASC
      LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export async function getLatestAppointments(limit = 5) {
  const [rows] = await pool.query(
    `
      SELECT
        appointments.id,
        appointments.customer_name,
        appointments.appointment_date,
        appointments.start_time,
        appointments.status,
        COALESCE(
          appointments.barber_name_snapshot,
          barbers.name,
          'Barbero eliminado'
        ) AS barber_name,
        services.name AS service_name
      FROM appointments
      LEFT JOIN barbers ON appointments.barber_id = barbers.id
      INNER JOIN services ON appointments.service_id = services.id
      ORDER BY appointments.created_at DESC
      LIMIT ?
    `,
    [limit]
  );

  return rows;
}

export async function getLatestNotifications(limit = 5) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        appointment_id,
        type,
        message,
        is_read,
        created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT ?
    `,
    [limit]
  );

  return rows;
}