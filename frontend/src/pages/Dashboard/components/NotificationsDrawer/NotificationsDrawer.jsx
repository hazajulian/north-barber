// NotificationsDrawer.jsx
// Contenedor lateral para abrir y cerrar las notificaciones
// sin depender del layout principal del dashboard.

import { useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";

import "./NotificationsDrawer.css";

export function NotificationsDrawer({
  isOpen,
  unreadCount = 0,
  onOpen,
  onClose,
  children,
}) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="notificationsDrawer__floatingButton"
        aria-label="Abrir notificaciones"
        aria-expanded={isOpen}
        onClick={onOpen}
      >
        <FaBell />

        {unreadCount > 0 && (
          <span>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notificationsDrawer">

          <button
            type="button"
            className="notificationsDrawer__overlay"
            aria-label="Cerrar notificaciones"
            onClick={onClose}
          />

          <aside
            className="notificationsDrawer__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Notificaciones"
          >

            <button
              type="button"
              className="notificationsDrawer__close"
              aria-label="Cerrar notificaciones"
              onClick={onClose}
            >
              <FaTimes />
            </button>

            <div className="notificationsDrawer__content">
              {children}
            </div>

          </aside>

        </div>
      )}
    </>
  );
}