// DashboardStats.jsx
// Muestra el resumen financiero principal del panel administrador.

import {
  FaCut,
  FaDollarSign,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";

import "./DashboardStats.css";

const PERIOD_OPTIONS = [
  {
    value: "day",
    label: "Día",
  },
  {
    value: "week",
    label: "Semana",
  },
  {
    value: "month",
    label: "Mes",
  },
];

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString("es-AR")}`;
}

function getPeriodLabel(period) {
  return (
    PERIOD_OPTIONS.find(
      (option) => option.value === period
    )?.label || "Mes"
  );
}

export function DashboardStats({
  revenue = {},
  period = "month",
  onPeriodChange,
  loading = false,
}) {
  const {
    period: revenuePeriod = period,
    totalRevenue = 0,
    averageTicket = 0,
    completedAppointments = 0,
    revenueByBarber = [],
  } = revenue;

  const activeBarbers =
    revenueByBarber.filter(
      (barber) =>
        Number(barber.completedAppointments) > 0
    ).length;

  const cards = [
    {
      icon: <FaDollarSign />,
      label: "Ingresos",
      value: formatMoney(totalRevenue),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Ticket promedio",
      value: formatMoney(averageTicket),
    },
    {
      icon: <FaCut />,
      label: "Servicios completados",
      value: completedAppointments,
    },
    {
      icon: <FaUserTie />,
      label: "Barberos con actividad",
      value: activeBarbers,
    },
  ];

  return (
    <section
      id="resumen"
      className={
        loading
          ? "dashboardStats dashboardStats--updating"
          : "dashboardStats"
      }
    >
      <div className="dashboardStats__header">
        <div>
          <span className="dashboardStats__eyebrow">
            Resumen financiero
          </span>

          <h2>
            Ingresos del negocio
          </h2>

          <p>
            Solo se cuentan reservas marcadas como completadas.
          </p>
        </div>

        <div className="dashboardStats__filters">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={loading}
              className={
                period === option.value
                  ? "dashboardStats__filter dashboardStats__filter--active"
                  : "dashboardStats__filter"
              }
              onClick={() =>
                onPeriodChange?.(option.value)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboardStats__cards">
        {cards.map((card) => (
          <article
            key={card.label}
            className="dashboardStat"
          >
            <div className="dashboardStat__icon">
              {card.icon}
            </div>

            <div className="dashboardStat__content">
              <span>
                {card.label}
              </span>

              <strong>
                {card.value}
              </strong>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboardStats__tableBox">
        <div className="dashboardStats__tableHeader">
          <h3>
            Ingresos por barbero
          </h3>

          <span>
            {getPeriodLabel(revenuePeriod)}
          </span>
        </div>

        {revenueByBarber.length > 0 ? (
          <div className="dashboardStats__tableWrapper">
            <table className="dashboardStats__table">
              <thead>
                <tr>
                  <th>Barbero</th>
                  <th>Servicios</th>
                  <th>Ingresos</th>
                </tr>
              </thead>

              <tbody>
                {revenueByBarber.map((barber) => (
                  <tr
                    key={
                      barber.barberId ||
                      barber.barberName
                    }
                  >
                    <td>
                      {barber.barberName}
                    </td>

                    <td>
                      {barber.completedAppointments}
                    </td>

                    <td>
                      {formatMoney(
                        barber.totalRevenue
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dashboardStats__empty">
            Todavía no hay ingresos completados en este período.
          </p>
        )}
      </div>
    </section>
  );
}