// AppointmentForm.jsx
// Agrupa los campos principales del formulario de reserva.

import {
  FaEnvelope,
  FaPen,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import "./AppointmentForm.css";

export function AppointmentForm({
  customerName,
  customerEmail,
  customerPhone,
  notes,
  rememberCustomer = false,
  onChange,
  onToggleRemember,
}) {
  return (
    <div className="appointmentForm">
      <div className="appointmentForm__header">
        <span className="eyebrow">
          Tus datos
        </span>

        <h2 className="appointmentForm__title">
          Completá tu información
        </h2>

        <p className="appointmentForm__text">
          Estos datos nos ayudan a revisar tu solicitud y avisarte cuando el
          turno sea confirmado.
        </p>
      </div>

      <div className="appointmentForm__grid">
        <label className="appointmentForm__field">
          <span>
            <FaUser />
            Nombre completo
          </span>

          <input
            type="text"
            name="customerName"
            value={customerName}
            onChange={onChange}
            placeholder="Ej: Juan Pérez"
            autoComplete="name"
          />
        </label>

        <label className="appointmentForm__field">
          <span>
            <FaEnvelope />
            Email
          </span>

          <input
            type="email"
            name="customerEmail"
            value={customerEmail}
            onChange={onChange}
            placeholder="Ej: juan@email.com"
            autoComplete="email"
          />
        </label>

        <label className="appointmentForm__field">
          <span>
            <FaPhone />
            Teléfono
          </span>

          <input
            type="tel"
            name="customerPhone"
            value={customerPhone}
            onChange={onChange}
            placeholder="Ej: 11 1234 5678"
            autoComplete="tel"
          />
        </label>

        <label className="appointmentForm__field appointmentForm__field--full">
          <span>
            <FaPen />
            Notas opcionales
          </span>

          <textarea
            name="notes"
            value={notes}
            onChange={onChange}
            placeholder="Ej: quiero un corte clásico, barba prolija, etc."
            rows="4"
          />
        </label>

        <label className="appointmentForm__remember appointmentForm__field--full">
          <input
            type="checkbox"
            checked={rememberCustomer}
            onChange={onToggleRemember}
          />

          <span>
            Recordar mi nombre, email y teléfono para futuras reservas.
          </span>
        </label>
      </div>
    </div>
  );
}