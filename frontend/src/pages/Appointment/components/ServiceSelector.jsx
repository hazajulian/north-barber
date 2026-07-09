// ServiceSelector.jsx
// Permite seleccionar el servicio para la reserva.

import {
  FaClock,
  FaCut,
  FaMoneyBillWave,
} from "react-icons/fa";

import "./ServiceSelector.css";

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

export function ServiceSelector({
  services,
  selectedServiceId,
  onSelectService,
}) {
  return (
    <section className="serviceSelector">
      <div className="serviceSelector__header">
        <span className="eyebrow">Servicio</span>

        <h2 className="serviceSelector__title">
          Elegí tu servicio
        </h2>

        <p className="serviceSelector__text">
          Seleccioná el tipo de atención que querés reservar.
        </p>
      </div>

      <div className="serviceSelector__grid">
        {services.map((service) => {
          const isSelected =
            String(selectedServiceId) === String(service.id);

          return (
            <button
              type="button"
              key={service.id}
              className={
                isSelected
                  ? "serviceSelector__card serviceSelector__card--active"
                  : "serviceSelector__card"
              }
              onClick={() => onSelectService(service.id)}
            >
              <div className="serviceSelector__icon">
                <FaCut />
              </div>

              <div className="serviceSelector__content">
                <div className="serviceSelector__top">
                  <h3>{service.name}</h3>

                  {isSelected && (
                    <span className="serviceSelector__selected">
                      Seleccionado
                    </span>
                  )}
                </div>

                <p>
                  {service.description ||
                    "Servicio profesional de barbería."}
                </p>

                <div className="serviceSelector__footer">
                  <span>
                    <FaClock />
                    {service.duration_minutes} min
                  </span>

                  <strong>
                    <FaMoneyBillWave />
                    {formatPrice(service.price)}
                  </strong>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}