// AppointmentStats.jsx
// Tarjetas resumen del estado actual de las reservas.
// Queda preparado para mostrar estadísticas reales cuando el backend las provea.

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";

import "./AppointmentStats.css";

export function AppointmentStats({
  stats = {},
}) {
  const {
    today = 0,
    upcoming = 0,
    completedMonth = 0,
    revenueMonth = null,
  } = stats;

  const cards = [
    {
      icon: <FaCalendarAlt />,
      label: "Turnos de hoy",
      value: today,
      color: "gold",
    },
    {
      icon: <FaClock />,
      label: "Próximos turnos",
      value: upcoming,
      color: "blue",
    },
    {
      icon: <FaCheckCircle />,
      label: "Completados este mes",
      value: completedMonth,
      color: "green",
    },
    {
      icon: <FaDollarSign />,
      label: "Ingresos del mes",
      value:
        revenueMonth === null
          ? "Próximamente"
          : `$${Number(
              revenueMonth
            ).toLocaleString("es-AR")}`,
      color: "orange",
    },
  ];

  return (
    <section className="appointmentStats">

      {cards.map((card) => (
        <article
          key={card.label}
          className={`appointmentStats__card appointmentStats__card--${card.color}`}
        >

          <div className="appointmentStats__icon">
            {card.icon}
          </div>

          <div className="appointmentStats__content">

            <span>
              {card.label}
            </span>

            <strong>
              {card.value}
            </strong>

          </div>

        </article>
      ))}

    </section>
  );
}