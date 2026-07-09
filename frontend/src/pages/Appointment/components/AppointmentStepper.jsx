// AppointmentStepper.jsx
// Muestra el progreso del flujo de reserva.

import "./AppointmentStepper.css";

const STEPS = [
  "Servicio",
  "Barbero",
  "Día",
  "Horario",
  "Datos",
  "Resumen",
];

export function AppointmentStepper({
  currentStep,
  onStepClick,
}) {
  return (
    <nav
      className="appointmentStepper"
      aria-label="Progreso de la reserva"
    >
      {STEPS.map((label, index) => {
        const step = index + 1;

        const className = [
          "appointmentStepper__item",
          currentStep === step
            ? "appointmentStepper__item--active"
            : "",
          currentStep > step
            ? "appointmentStepper__item--completed"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={label}
            type="button"
            className={className}
            onClick={() => onStepClick?.(step)}
          >
            <span className="appointmentStepper__number">
              {currentStep > step ? "✓" : step}
            </span>

            <span className="appointmentStepper__label">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}