// SuccessMessage.jsx
// Mensaje mostrado cuando la reserva fue enviada correctamente.

import {
  FaCheck,
  FaHome,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "./SuccessMessage.css";

const WEEK_DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatDate(dateValue) {
  if (!dateValue) {
    return "Fecha no disponible";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return `${WEEK_DAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

function formatTime(timeValue) {
  if (!timeValue) {
    return "Horario no disponible";
  }

  return String(timeValue).slice(0, 5);
}

export function SuccessMessage({
  appointment,
  onCreateAnother,
}) {
  return (
    <section className="successMessage card">
      <div className="successMessage__icon">
        <FaCheck />
      </div>

      <div className="successMessage__content">
        <span className="eyebrow">
          Solicitud enviada
        </span>

        <h2 className="successMessage__title">
          ¡Recibimos tu reserva!
        </h2>

        <p className="successMessage__text">
          Tu solicitud fue registrada correctamente. El administrador revisará el turno y te enviaremos un correo cuando la reserva sea confirmada.
        </p>
      </div>

      {appointment && (
        <div className="successMessage__details">
          <div>
            <span>Cliente</span>
            <strong>
              {appointment.customer_name}
            </strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>
              {formatDate(appointment.appointment_date)}
            </strong>
          </div>

          <div>
            <span>Horario</span>
            <strong>
              {formatTime(appointment.start_time)}
            </strong>
          </div>

          <div>
            <span>Estado</span>
            <strong className="successMessage__status">
              Pendiente de confirmación
            </strong>
          </div>
        </div>
      )}

      <div className="successMessage__info">
        <strong>Tené paciencia mientras confirmamos tu turno.</strong>
        <span>
          Si pasa un rato y no recibís respuesta, revisá el correo no deseado o escribinos desde la página de inicio.
        </span>
      </div>

      <div className="successMessage__demoNotice">
        <strong>Importante:</strong>
        <span>
          Esta es una página ficticia creada como proyecto web. La reserva no corresponde a una barbería real, así que no vayas a cortarte el pelo por este turno jajaja.
        </span>
      </div>

      <div className="successMessage__actions">
        <Link
          to="/"
          className="btn btn--secondary successMessage__button"
        >
          <FaHome />
          Ir al inicio
        </Link>

        <button
          type="button"
          className="btn btn--primary successMessage__button"
          onClick={onCreateAnother}
        >
          <FaWhatsapp />
          Reservar otro turno
        </button>
      </div>
    </section>
  );
}