// AppointmentStatusModal.jsx
// Modal para cambiar el estado de una reserva.

import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";

import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

import "./AppointmentStatusModal.css";

const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_OPTIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "-";

  return String(time).slice(0, 5);
}

function getAppointmentComment(appointment) {
  return (
    appointment.comment ||
    appointment.notes ||
    appointment.customer_comment ||
    "Sin comentario"
  );
}

export function AppointmentStatusModal({
  open,
  loading = false,
  appointment,
  result,
  onCancel,
  onConfirm,
}) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const currentStatus = appointment?.status || "pending";

  const availableStatuses = useMemo(() => {
    return STATUS_OPTIONS[currentStatus] || [];
  }, [currentStatus]);

  const isCancelling = selectedStatus === "cancelled";

  const canSubmit =
    Boolean(selectedStatus) &&
    !loading &&
    !result?.visible;

  useEffect(() => {
    if (!open) return;

    setSelectedStatus("");
    setCustomMessage("");
  }, [open, appointment]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open || !appointment) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedStatus || loading || result?.visible) {
      return;
    }

    onConfirm({
      status: selectedStatus,
      sendEmail: isCancelling,
      customMessage: isCancelling
        ? customMessage.trim()
        : "",
    });
  }

    return (
    <div
      className="appointmentStatusModal"
      onClick={
        !loading && !result?.visible
          ? onCancel
          : undefined
      }
    >
      <form
        className="appointmentStatusModal__panel"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        {!result?.visible && (
          <button
            type="button"
            className="appointmentStatusModal__close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        )}

        {result?.visible ? (
          <div
            className={
              result.success
                ? "appointmentStatusModal__result appointmentStatusModal__result--success"
                : "appointmentStatusModal__result appointmentStatusModal__result--error"
            }
          >
            <div className="appointmentStatusModal__resultIcon">
              {result.success ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationTriangle />
              )}
            </div>

            <h2>{result.title}</h2>

            <p>{result.message}</p>

            {result.success && (
              <small>
                Cerrando automáticamente...
              </small>
            )}
          </div>
        ) : (
          <>
            <div className="appointmentStatusModal__header">
              <div className="appointmentStatusModal__icon">
                <FaCalendarCheck />
              </div>

              <div>
                <span>Cambiar estado</span>

                <h2>
                  {appointment.customer_name ||
                    "Reserva"}
                </h2>
              </div>
            </div>

            <div className="appointmentStatusModal__summary">
              <div>
                <span>Servicio</span>

                <strong>
                  {appointment.service_name || "-"}
                </strong>
              </div>

              <div>
                <span>Barbero</span>

                <strong>
                  {appointment.barber_name || "-"}
                </strong>
              </div>

              <div>
                <span>Fecha</span>

                <strong>
                  {formatDate(
                    appointment.appointment_date
                  )}
                </strong>
              </div>

              <div>
                <span>Horario</span>

                <strong>
                  {formatTime(
                    appointment.start_time
                  )}
                  {appointment.end_time
                    ? ` - ${formatTime(
                        appointment.end_time
                      )}`
                    : ""}
                </strong>
              </div>

              <div className="appointmentStatusModal__comment">
                <span>
                  Comentario del cliente
                </span>

                <p>
                  {getAppointmentComment(
                    appointment
                  )}
                </p>
              </div>
            </div>

            <div className="appointmentStatusModal__current">
              <span>Estado actual</span>

              <AppointmentStatusBadge
                status={currentStatus}
              />
            </div>

            {availableStatuses.length > 0 ? (
              <div className="appointmentStatusModal__options">
                {availableStatuses.map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      className={
                        selectedStatus ===
                        status
                          ? "appointmentStatusModal__option appointmentStatusModal__option--selected"
                          : "appointmentStatusModal__option"
                      }
                      onClick={() =>
                        setSelectedStatus(status)
                      }
                      disabled={loading}
                    >
                      {status ===
                      "cancelled" ? (
                        <FaTimesCircle />
                      ) : (
                        <FaCheck />
                      )}

                      <span>
                        {STATUS_LABELS[status]}
                      </span>
                    </button>
                  )
                )}
              </div>
            ) : (
              <p className="appointmentStatusModal__locked">
                Esta reserva ya está cerrada y no
                permite nuevos cambios.
              </p>
            )}

            {isCancelling && (
              <div className="appointmentStatusModal__emailBox">
                <div className="appointmentStatusModal__notice">
                  <strong>
                    Se enviará un correo al cliente
                  </strong>

                  <p>
                    Podés agregar un mensaje
                    personalizado del barbero.
                    Si lo dejás vacío, el sistema
                    utilizará el mensaje automático
                    de cancelación.
                  </p>
                </div>

                <label className="appointmentStatusModal__textarea">
                  <span>
                    Mensaje personalizado
                    opcional
                  </span>

                  <textarea
                    value={customMessage}
                    rows="4"
                    maxLength="1000"
                    placeholder="Ejemplo: Lamentamos tener que cancelar tu turno. Podemos ayudarte a coordinar uno nuevo."
                    onChange={(event) =>
                      setCustomMessage(
                        event.target.value
                      )
                    }
                    disabled={loading}
                  />

                  <small>
                    Este mensaje no se guarda en la
                    base de datos. Solo se utiliza
                    para construir el correo.
                  </small>
                </label>
              </div>
            )}

            <div className="appointmentStatusModal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={
                  selectedStatus ===
                  "cancelled"
                    ? "btn appointmentStatusModal__dangerButton"
                    : "btn btn--primary"
                }
                disabled={!canSubmit}
              >
                {loading
                  ? "Procesando..."
                  : "Guardar cambio"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}