// DashboardHeader.jsx
// Encabezado principal del panel administrador.

import {
  FaCalendarCheck,
  FaCut,
  FaUserTie,
} from "react-icons/fa";

import "./DashboardHeader.css";

export function DashboardHeader() {
  return (
    <header className="dashboardHeader" id="resumen">
      <div className="dashboardHeader__content">
        <span className="eyebrow">
          North Barber · Administración
        </span>

        <h1 className="dashboardHeader__title title">
          Panel de administración
        </h1>

        <p className="dashboardHeader__description">
          Administrá todos los aspectos del negocio desde un único lugar.
          Gestioná servicios, barberos, reservas, horarios y mantené el
          funcionamiento diario de la barbería de forma rápida y sencilla.
        </p>
      </div>

      <div className="dashboardHeader__card" aria-hidden="true">
        <span className="dashboardHeader__cardLabel">
          Gestión rápida
        </span>

        <div className="dashboardHeader__cardItem">
          <FaCut />
          <span>Servicios</span>
        </div>

        <div className="dashboardHeader__cardItem">
          <FaUserTie />
          <span>Barberos</span>
        </div>

        <div className="dashboardHeader__cardItem">
          <FaCalendarCheck />
          <span>Reservas</span>
        </div>
      </div>
    </header>
  );
}