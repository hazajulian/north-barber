// controllers/notification-controller.js
// Controla las peticiones relacionadas con notificaciones internas.

import {
  deleteNotificationService,
  getAllNotificationsService,
  getUnreadNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "../services/notification-service.js";

import { sendSuccess } from "../utils/response.js";

export async function listNotifications(req, res, next) {
  try {
    const notifications =
      await getAllNotificationsService(req.query);

    return sendSuccess(
      res,
      "Notifications retrieved successfully",
      notifications
    );
  } catch (error) {
    next(error);
  }
}

export async function listUnreadNotifications(req, res, next) {
  try {
    const notifications =
      await getUnreadNotificationsService();

    return sendSuccess(
      res,
      "Unread notifications retrieved successfully",
      notifications
    );
  } catch (error) {
    next(error);
  }
}

export async function readNotification(req, res, next) {
  try {
    const notification =
      await markNotificationReadService(
        req.params.id
      );

    return sendSuccess(
      res,
      "Notification marked as read successfully",
      notification
    );
  } catch (error) {
    next(error);
  }
}

export async function readAllNotifications(req, res, next) {
  try {
    const notifications =
      await markAllNotificationsReadService();

    return sendSuccess(
      res,
      "All notifications marked as read successfully",
      notifications
    );
  } catch (error) {
    next(error);
  }
}

export async function removeNotification(
  req,
  res,
  next
) {
  try {
    const notification =
      await deleteNotificationService(
        req.params.id
      );

    return sendSuccess(
      res,
      "Notification deleted successfully",
      notification
    );
  } catch (error) {
    next(error);
  }
}