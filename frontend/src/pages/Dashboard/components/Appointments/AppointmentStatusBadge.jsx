// AppointmentStatusBadge.jsx
// Muestra el estado actual de una reserva.

import {
  FaCheckCircle,
  FaRegClock,
  FaTimesCircle,
  FaCheckDouble,
} from "react-icons/fa";

import "./AppointmentStatusBadge.css";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    Icon: FaRegClock,
  },

  confirmed: {
    label: "Confirmada",
    Icon: FaCheckCircle,
  },

  cancelled: {
    label: "Cancelada",
    Icon: FaTimesCircle,
  },

  completed: {
    label: "Completada",
    Icon: FaCheckDouble,
  },
};

export function AppointmentStatusBadge({
  status = "pending",
}) {
  const config =
    STATUS_CONFIG[status] ??
    STATUS_CONFIG.pending;

  const Icon = config.Icon;

  return (
    <span
      className={`appointmentStatusBadge appointmentStatusBadge--${status}`}
    >
      <span className="appointmentStatusBadge__icon">
        <Icon aria-hidden="true" />
      </span>

      <span className="appointmentStatusBadge__label">
        {config.label}
      </span>
    </span>
  );
}