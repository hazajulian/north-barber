// AppointmentSummary.jsx
// Muestra el resumen de la reserva antes de enviarla.

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCut,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

import "./AppointmentSummary.css";

function formatDate(date) {
  if (!date) {
    return "Sin seleccionar";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "es-AR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );
}

function formatPrice(price) {
  if (!price) {
    return "—";
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AppointmentSummary({
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
  loading,
  onSubmit,
}) {
  const barberName =
    selectedBarber?.name ??
    "Asignación automática";

  const isReady =
    selectedService &&
    selectedDate &&
    selectedTime;

  return (
    <aside className="appointmentSummary card">
      <div className="appointmentSummary__header">
        <span className="eyebrow">
          Resumen
        </span>

        <h3 className="appointmentSummary__title">
          Tu reserva
        </h3>

        <p className="appointmentSummary__text">
          Verificá toda la información antes de enviar la solicitud.
        </p>
      </div>

      <div className="appointmentSummary__status">
        <FaCheckCircle />

        <div>
          <span>Estado inicial</span>

          <strong>
            Pendiente de confirmación
          </strong>
        </div>
      </div>

      <div className="appointmentSummary__ticket">
        <div className="appointmentSummary__row">
          <div className="appointmentSummary__label">
            <FaCut />
            Servicio
          </div>

          <strong>
            {selectedService?.name ??
              "Sin seleccionar"}
          </strong>
        </div>

        <div className="appointmentSummary__row">
          <div className="appointmentSummary__label">
            <FaUser />
            Barbero
          </div>

          <strong>{barberName}</strong>
        </div>

        <div className="appointmentSummary__row">
          <div className="appointmentSummary__label">
            <FaCalendarAlt />
            Fecha
          </div>

          <strong>
            {formatDate(selectedDate)}
          </strong>
        </div>

        <div className="appointmentSummary__row">
          <div className="appointmentSummary__label">
            <FaClock />
            Horario
          </div>

          <strong>
            {selectedTime ??
              "Sin seleccionar"}
          </strong>
        </div>

        <div className="appointmentSummary__row">
          <div className="appointmentSummary__label">
            <FaHourglassHalf />
            Duración
          </div>

          <strong>
            {selectedService?.duration_minutes
              ? `${selectedService.duration_minutes} min`
              : "—"}
          </strong>
        </div>

        <div className="appointmentSummary__divider" />

        <div className="appointmentSummary__total">
          <div className="appointmentSummary__label appointmentSummary__label--price">
            <FaMoneyBillWave />
            Total
          </div>

          <strong>
            {formatPrice(selectedService?.price)}
          </strong>
        </div>
      </div>

      <div className="appointmentSummary__conditions">
        <h4>Antes de confirmar</h4>

        <ul>
          <li>El turno será revisado por la barbería.</li>
          <li>Recibirás un correo cuando sea confirmado.</li>
          <li>
            Si fuera necesario, la barbería podrá contactarte para
            reprogramarlo.
          </li>
        </ul>
      </div>

      <button
        type="button"
        className="btn btn--primary appointmentSummary__button"
        onClick={onSubmit}
        disabled={loading || !isReady}
      >
        {loading
          ? "Enviando solicitud..."
          : "Enviar solicitud"}
      </button>

      {!isReady && (
        <p className="appointmentSummary__hint">
          Completá todos los pasos para habilitar el envío.
        </p>
      )}
    </aside>
  );
}