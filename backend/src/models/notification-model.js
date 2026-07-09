// models/notification-model.js
// Gestiona las consultas SQL relacionadas con notificaciones internas.

import pool from "../config/database.js";

export async function deleteOldNotifications(days = 7) {
  await pool.query(
    `DELETE FROM notifications
     WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [days]
  );
}

export async function getAllNotifications({
  page = 1,
  limit = 8,
} = {}) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT *
     FROM notifications
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM notifications`
  );

  return {
    notifications: rows,
    pagination: {
      page,
      limit,
      total: countRows[0].total,
      totalPages: Math.max(
        1,
        Math.ceil(countRows[0].total / limit)
      ),
    },
  };
}

export async function getUnreadNotifications() {
  const [rows] = await pool.query(
    `SELECT *
     FROM notifications
     WHERE is_read = FALSE
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function createNotification(notificationData) {
  const {
    appointment_id,
    type,
    message,
  } = notificationData;

  const [result] = await pool.query(
    `INSERT INTO notifications (
      appointment_id,
      type,
      message
    )
    VALUES (?, ?, ?)`,
    [
      appointment_id,
      type,
      message,
    ]
  );

  return getNotificationById(result.insertId);
}

export async function getNotificationById(id) {
  const [rows] = await pool.query(
    `SELECT *
     FROM notifications
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function markNotificationAsRead(id) {
  await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = ?`,
    [id]
  );

  return getNotificationById(id);
}

export async function markAllNotificationsAsRead() {
  await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE is_read = FALSE`
  );

  return getAllNotifications();
}

export async function deleteNotification(id) {
  const notification =
    await getNotificationById(id);

  if (!notification) {
    return null;
  }

  await pool.query(
    `DELETE FROM notifications
     WHERE id = ?`,
    [id]
  );

  return notification;
}