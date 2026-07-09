// notificationService.js
// Centraliza las peticiones relacionadas con las notificaciones internas.

import { apiRequest } from "./api";

export function getNotifications(
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  return apiRequest(
    `/notifications?${params.toString()}`
  );
}

export function getUnreadNotifications() {
  return apiRequest(
    "/notifications/unread"
  );
}

export function markNotificationAsRead(id) {
  return apiRequest(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  );
}

export function markAllNotificationsAsRead() {
  return apiRequest(
    "/notifications/read-all",
    {
      method: "PATCH",
    }
  );
}

export function deleteNotification(id) {
  return apiRequest(
    `/notifications/${id}`,
    {
      method: "DELETE",
    }
  );
}