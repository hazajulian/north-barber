// NotificationsPanel.jsx
// Muestra y administra las notificaciones internas del panel.

import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../../services/notificationService";

import "./NotificationsPanel.css";

const PAGE_SIZE = 10;

const TYPE_LABELS = {
  appointment_created: "Nueva reserva",
  appointment_confirmed: "Reserva confirmada",
  appointment_cancelled: "Reserva cancelada",
  appointment_completed: "Reserva completada",
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNotificationTitle(notification) {
  return (
    notification.title ||
    TYPE_LABELS[notification.type] ||
    "Notificación"
  );
}

function getNotificationsFromResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.notifications || [];
}

function getPaginationFromResponse(response) {
  return (
    response?.pagination || {
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    }
  );
}

export function NotificationsPanel({
  refreshKey = 0,
  onRefresh,
}) {
  const [notifications, setNotifications] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    });

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [hasLoadedOnce, setHasLoadedOnce] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;
  }, [notifications]);

  async function loadNotifications(
    targetPage = page,
    silent = false
  ) {
    try {
      if (!silent) {
        setLoading(true);
      }

      setError("");

      const response =
        await getNotifications(
          targetPage,
          PAGE_SIZE
        );

      setNotifications(
        getNotificationsFromResponse(
          response
        )
      );

      setPagination(
        getPaginationFromResponse(
          response
        )
      );

      setHasLoadedOnce(true);
    } catch (error) {
      setError(
        error.message ||
          "No se pudieron cargar las notificaciones."
      );
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const silent = hasLoadedOnce;

    loadNotifications(page, silent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    refreshKey,
  ]);

  async function handleDelete(id) {
    try {
      setActionLoading(true);

      await deleteNotification(id);

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.id !== id
        )
      );

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      setError(
        error.message ||
          "No se pudo eliminar la notificación."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRead(id) {
    try {
      setActionLoading(true);

      await markNotificationAsRead(id);

      setNotifications((currentNotifications) =>
        currentNotifications.map(
          (notification) =>
            notification.id === id
              ? {
                  ...notification,
                  is_read: true,
                }
              : notification
        )
      );

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      setError(
        error.message ||
          "No se pudo marcar la notificación como leída."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReadAll() {
    try {
      setActionLoading(true);

      await markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map(
          (notification) => ({
            ...notification,
            is_read: true,
          })
        )
      );

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      setError(
        error.message ||
          "No se pudieron marcar las notificaciones como leídas."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="notificationsPanel">
      <div className="notificationsPanel__header">
        <div className="notificationsPanel__headerText">
          <h3>Centro de avisos</h3>

          <span>{unreadCount} sin leer</span>
        </div>

        <button
          type="button"
          className="btn btn--outline notificationsPanel__readAllButton"
          disabled={
            actionLoading ||
            unreadCount === 0
          }
          onClick={handleReadAll}
        >
          Marcar todas
        </button>
      </div>

      {error && (
        <p className="notificationsPanel__error">
          {error}
        </p>
      )}

      {loading && !hasLoadedOnce ? (
        <div className="notificationsPanel__loading">
          Cargando notificaciones...
        </div>
      ) : notifications.length > 0 ? (
        <div className="notificationsPanel__body">
          <div className="notificationsPanel__list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={
                  notification.is_read
                    ? "notificationsPanel__item"
                    : "notificationsPanel__item notificationsPanel__item--unread"
                }
              >
                <button
                  type="button"
                  className="notificationsPanel__hideButton"
                  aria-label="Eliminar notificación"
                  title="Eliminar notificación"
                  disabled={actionLoading}
                  onClick={() =>
                    handleDelete(notification.id)
                  }
                >
                  <span className="notificationsPanel__hideIcon">
                    <FaTrashAlt aria-hidden="true" />
                  </span>
                </button>

                <div className="notificationsPanel__content">
                  <div className="notificationsPanel__titleRow">
                    <strong>
                      {getNotificationTitle(
                        notification
                      )}
                    </strong>

                    {!notification.is_read && (
                      <span className="notificationsPanel__badge">
                        Nueva
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <small>
                    {formatDate(
                      notification.created_at
                    )}
                    {" · "}
                    {formatTime(
                      notification.created_at
                    )}
                  </small>
                </div>

                {!notification.is_read && (
                  <button
                    type="button"
                    className="notificationsPanel__readButton"
                    disabled={actionLoading}
                    onClick={() =>
                      handleRead(notification.id)
                    }
                  >
                    Marcar leída
                  </button>
                )}
              </article>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="notificationsPanel__pagination">
              <button
                type="button"
                className="btn btn--outline"
                disabled={page === 1}
                onClick={() =>
                  setPage((previous) =>
                    previous - 1
                  )
                }
              >
                Anterior
              </button>

              <span>
                Página {pagination.page} de{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                className="btn btn--outline"
                disabled={
                  page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage((previous) =>
                    previous + 1
                  )
                }
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="notificationsPanel__empty">
          No hay notificaciones.
        </p>
      )}
    </div>
  );
}