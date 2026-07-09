// DashboardSection.jsx
// Contenedor reutilizable para secciones del dashboard.

import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./DashboardSection.css";

export function DashboardSection({
  id,
  title,
  description,
  action,
  collapsible = true,
  defaultCollapsed = false,
  variant = "default",
  children,
}) {
  const storageKey =
    `north_barber_dashboard_section_${id}`;

  const [collapsed, setCollapsed] =
    useState(() => {
      if (!collapsible) {
        return false;
      }

      const savedValue =
        localStorage.getItem(storageKey);

      if (savedValue) {
        return savedValue === "collapsed";
      }

      return defaultCollapsed;
    });

  useEffect(() => {
    if (!collapsible) return;

    localStorage.setItem(
      storageKey,
      collapsed
        ? "collapsed"
        : "expanded"
    );
  }, [
    collapsed,
    collapsible,
    storageKey,
  ]);

  function handleToggle() {
    if (!collapsible) return;

    setCollapsed(
      (previous) => !previous
    );
  }

  return (
    <section
      className={`dashboardSection dashboardSection--${variant}`}
      id={id}
    >
      <div className="dashboardSection__header">

        <div className="dashboardSection__info">
          <h2>{title}</h2>

          {description && (
            <p>{description}</p>
          )}
        </div>

        <div className="dashboardSection__right">

          {action && !collapsed && (
            <div className="dashboardSection__action">
              {action}
            </div>
          )}

          {collapsible && (
            <button
              type="button"
              className="dashboardSection__toggle"
              onClick={handleToggle}
              aria-label={
                collapsed
                  ? "Mostrar contenido"
                  : "Ocultar contenido"
              }
            >
              {collapsed
                ? <FaChevronDown />
                : <FaChevronUp />}
            </button>
          )}

        </div>

      </div>

      {!collapsed && (
        <div className="dashboardSection__content">
          {children}
        </div>
      )}

    </section>
  );
}