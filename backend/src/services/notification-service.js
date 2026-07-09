// services/notification-service.js
// Gestiona la logica relacionada con notificaciones internas.

import {
  createNotification,
  deleteNotification,
  deleteOldNotifications,
  getAllNotifications,
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../models/notification-model.js";

const NOTIFICATION_RETENTION_DAYS = 7;

const NOTIFICATION_TYPES = {
  appointment_created: "Nueva reserva",
  appointment_confirmed: "Reserva confirmada",
  appointment_cancelled: "Reserva cancelada",
  appointment_completed: "Reserva completada",
};

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function formatTime(time) {
  return String(time).slice(0, 5);
}

function normalizePagination(query) {
  const page = Math.max(
    1,
    Number(query.page) || 1
  );

  const limit = Math.min(
    20,
    Math.max(
      1,
      Number(query.limit) || 8
    )
  );

  return {
    page,
    limit,
  };
}

function mapNotification(notification) {
  return {
    ...notification,
    title:
      NOTIFICATION_TYPES[
        notification.type
      ] || "Notificación",
  };
}

function mapNotificationResponse(response) {
  return {
    notifications:
      response.notifications.map(
        mapNotification
      ),

    pagination:
      response.pagination,
  };
}

export async function getAllNotificationsService(
  query = {}
) {
  await deleteOldNotifications(
    NOTIFICATION_RETENTION_DAYS
  );

  const pagination =
    normalizePagination(query);

  const response =
    await getAllNotifications(
      pagination
    );

  return mapNotificationResponse(
    response
  );
}

export async function getUnreadNotificationsService() {
  await deleteOldNotifications(
    NOTIFICATION_RETENTION_DAYS
  );

  const notifications =
    await getUnreadNotifications();

  return notifications.map(
    mapNotification
  );
}

export async function markNotificationReadService(
  id
) {
  const notification =
    await markNotificationAsRead(id);

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return mapNotification(
    notification
  );
}

export async function markAllNotificationsReadService() {
  const response =
    await markAllNotificationsAsRead();

  return mapNotificationResponse(
    response
  );
}

export async function deleteNotificationService(
  id
) {
  const notification =
    await deleteNotification(id);

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return mapNotification(
    notification
  );
}

export async function createAppointmentNotification(
  appointment
) {
  return createNotification({
    appointment_id:
      appointment.id,

    type:
      "appointment_created",

    message:
      `Nueva reserva de ${appointment.customer_name} ` +
      `para el ${formatDate(
        appointment.appointment_date
      )} ` +
      `a las ${formatTime(
        appointment.start_time
      )}.`,
  });
}

export async function createStatusNotification(
  appointment,
  status
) {
  const statusLabels = {
    pending: "pendiente",
    confirmed: "confirmada",
    cancelled: "cancelada",
    completed: "completada",
  };

  return createNotification({
    appointment_id:
      appointment.id,

    type:
      `appointment_${status}`,

    message:
      `La reserva de ${appointment.customer_name} ` +
      `fue marcada como ${
        statusLabels[status] ||
        status
      }.`,
  });
}