// DashboardSidebar.jsx
// Barra lateral principal del panel administrador.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaBusinessTime,
  FaCalendarCheck,
  FaChartPie,
  FaCog,
  FaCut,
  FaSignOutAlt,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";

import logo from "../../../../assets/logo/logo.png";

import "./DashboardSidebar.css";

const navItems = [
  {
    href: "#resumen",
    label: "Resumen",
    icon: <FaChartPie />,
  },
  {
    href: "#servicios",
    label: "Servicios",
    icon: <FaCut />,
  },
  {
    href: "#barberos",
    label: "Barberos",
    icon: <FaUserTie />,
  },
  {
    href: "#reservas",
    label: "Reservas",
    icon: <FaCalendarCheck />,
  },
  {
    href: "#horarios",
    label: "Horarios",
    icon: <FaBusinessTime />,
  },
  {
    href: "#perfil",
    label: "Perfil",
    icon: <FaCog />,
  },
];

export function DashboardSidebar({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <button
        className="dashboardSidebarToggle"
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú del panel"
      >
        <FaBars />
      </button>

      <div
        className={
          mobileOpen
            ? "dashboardSidebarOverlay dashboardSidebarOverlay--open"
            : "dashboardSidebarOverlay"
        }
        onClick={closeMobileMenu}
      />

      <aside
        className={
          mobileOpen
            ? "dashboardSidebar dashboardSidebar--open"
            : "dashboardSidebar"
        }
      >
        <div className="dashboardSidebar__top">
          <Link
            to="/"
            className="dashboardSidebar__brand"
            aria-label="Volver al inicio de North Barber"
            onClick={closeMobileMenu}
          >
            <img src={logo} alt="North Barber" />
            <span>North Barber</span>
          </Link>

          <button
            className="dashboardSidebar__close"
            type="button"
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
          >
            <FaTimes />
          </button>
        </div>

        <nav
          className="dashboardSidebar__nav"
          aria-label="Navegación del panel"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          className="dashboardSidebar__logout"
          type="button"
          onClick={onLogout}
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>
      </aside>
    </>
  );
}