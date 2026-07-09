// AppointmentCta.jsx
// Llamado a la acción para reservar turno.

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./AppointmentCta.css";

export function AppointmentCta() {
  return (
    <section className="appointmentCta section">
      <div className="appointmentCta__container container">
        <span className="eyebrow">Reservas</span>

        <h2 className="appointmentCta__title title">
          ¿Listo para renovar tu estilo?
        </h2>

        <p className="appointmentCta__text">
          Elegí el servicio que mejor se adapte a vos, seleccioná un horario y
          enviá tu solicitud en menos de un minuto. Nosotros nos encargamos del
          resto.
        </p>

        <div className="appointmentCta__features">
          <span>✓ Reserva online</span>
          <span>✓ Confirmación por correo</span>
          <span>✓ Elegí tu barbero</span>
        </div>

        <Link
          to="/appointment"
          className="btn btn--primary appointmentCta__button"
        >
          Reservar turno
          <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}