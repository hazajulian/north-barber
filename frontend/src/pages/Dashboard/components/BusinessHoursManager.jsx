// BusinessHoursManager.jsx
// Administra los días y horarios de atención del negocio.

import { useMemo, useState } from "react";

import { updateBusinessHours } from "../../../services/businessHoursService";

import "./BusinessHoursManager.css";

const DAYS = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const DEFAULT_BREAK_START = "13:00";
const DEFAULT_BREAK_END = "14:00";

function formatTime(time) {
  if (!time) return "";

  return String(time).slice(0, 5);
}

function getHourValue(hour, edited, field) {
  return edited[field] ?? formatTime(hour[field]);
}

function getBooleanValue(hour, edited, field) {
  return edited[field] ?? Boolean(hour[field]);
}

function getBreakValue(hour, edited, field, fallback) {
  return (
    edited[field] ??
    formatTime(hour[field]) ??
    fallback
  );
}

function buildPayload(hour, edited) {
  const isOpen =
    edited.is_open ?? Boolean(hour.is_open);

  const hasBreak =
    isOpen &&
    (edited.has_break ?? Boolean(hour.has_break));

  return {
    open_time:
      edited.open_time ??
      formatTime(hour.open_time),

    close_time:
      edited.close_time ??
      formatTime(hour.close_time),

    is_open: isOpen,

    has_break: hasBreak,

    break_start_time: hasBreak
      ? getBreakValue(
          hour,
          edited,
          "break_start_time",
          DEFAULT_BREAK_START
        )
      : null,

    break_end_time: hasBreak
      ? getBreakValue(
          hour,
          edited,
          "break_end_time",
          DEFAULT_BREAK_END
        )
      : null,
  };
}

function sortBusinessHours(businessHours) {
  return [...businessHours].sort(
    (firstHour, secondHour) =>
      firstHour.day_of_week - secondHour.day_of_week
  );
}

export function BusinessHoursManager({
  businessHours = [],
  onRefresh,
}) {
  const [editingRows, setEditingRows] =
    useState({});

  const [loadingId, setLoadingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [successId, setSuccessId] =
    useState(null);

  const sortedBusinessHours = useMemo(() => {
    return sortBusinessHours(businessHours);
  }, [businessHours]);

  function handleChange(id, field, value) {
    setEditingRows((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));

    setError("");
    setSuccessId(null);
  }

  function handleBreakChange(hour, checked) {
    setEditingRows((previous) => {
      const current = previous[hour.id] || {};

      return {
        ...previous,
        [hour.id]: {
          ...current,
          has_break: checked,
          break_start_time: checked
            ? current.break_start_time ||
              formatTime(hour.break_start_time) ||
              DEFAULT_BREAK_START
            : "",
          break_end_time: checked
            ? current.break_end_time ||
              formatTime(hour.break_end_time) ||
              DEFAULT_BREAK_END
            : "",
        },
      };
    });

    setError("");
    setSuccessId(null);
  }

  function handleOpenChange(hour, checked) {
    setEditingRows((previous) => {
      const current = previous[hour.id] || {};

      return {
        ...previous,
        [hour.id]: {
          ...current,
          is_open: checked,
          has_break: checked
            ? current.has_break ??
              Boolean(hour.has_break)
            : false,
        },
      };
    });

    setError("");
    setSuccessId(null);
  }

  async function handleSave(hour) {
    const id = hour.id;
    const edited = editingRows[id] || {};

    try {
      setLoadingId(id);
      setError("");
      setSuccessId(null);

      await updateBusinessHours(
        id,
        buildPayload(hour, edited)
      );

      if (onRefresh) {
        await onRefresh();
      }

      setEditingRows((previous) => {
        const copy = { ...previous };
        delete copy[id];

        return copy;
      });

      setSuccessId(id);

      setTimeout(() => {
        setSuccessId((currentId) =>
          currentId === id ? null : currentId
        );
      }, 2200);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo actualizar el horario."
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="businessHoursManager">

      {error && (
        <p className="businessHoursManager__error">
          {error}
        </p>
      )}

      <div className="businessHoursManager__list">

        {sortedBusinessHours.length > 0 ? (
          sortedBusinessHours.map((hour) => {
            const edited =
              editingRows[hour.id] || {};

            const isOpen =
              getBooleanValue(
                hour,
                edited,
                "is_open"
              );

            const breakEnabled =
              isOpen &&
              getBooleanValue(
                hour,
                edited,
                "has_break"
              );

            const isLoading =
              loadingId === hour.id;

            const wasSaved =
              successId === hour.id;

            return (
              <article
                className={
                  isOpen
                    ? "businessHoursManager__row"
                    : "businessHoursManager__row businessHoursManager__row--closed"
                }
                key={hour.id}
              >
                <div className="businessHoursManager__day">
                  <strong>
                    {DAYS[hour.day_of_week]}
                  </strong>

                  <span>
                    {isOpen
                      ? "Día activo"
                      : "Día cerrado"}
                  </span>
                </div>

                <div className="businessHoursManager__schedule">

                  <div className="businessHoursManager__timeGrid">

                    <label className="businessHoursManager__field">
                      <span>Abre</span>

                      <input
                        type="time"
                        value={getHourValue(
                          hour,
                          edited,
                          "open_time"
                        )}
                        disabled={!isOpen || isLoading}
                        onChange={(event) =>
                          handleChange(
                            hour.id,
                            "open_time",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label className="businessHoursManager__field">
                      <span>Cierra</span>

                      <input
                        type="time"
                        value={getHourValue(
                          hour,
                          edited,
                          "close_time"
                        )}
                        disabled={!isOpen || isLoading}
                        onChange={(event) =>
                          handleChange(
                            hour.id,
                            "close_time",
                            event.target.value
                          )
                        }
                      />
                    </label>

                  </div>

                  <label className="businessHoursManager__toggle">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      disabled={isLoading}
                      onChange={(event) =>
                        handleOpenChange(
                          hour,
                          event.target.checked
                        )
                      }
                    />

                    <span>Abierto</span>
                  </label>

                </div>

                <div className="businessHoursManager__break">

                  <label className="businessHoursManager__toggle">
                    <input
                      type="checkbox"
                      checked={breakEnabled}
                      disabled={!isOpen || isLoading}
                      onChange={(event) =>
                        handleBreakChange(
                          hour,
                          event.target.checked
                        )
                      }
                    />

                    <span>Descanso</span>
                  </label>

                  <div className="businessHoursManager__breakFields">

                    <label className="businessHoursManager__field">
                      <span>Inicio</span>

                      <input
                        type="time"
                        value={
                          breakEnabled
                            ? getBreakValue(
                                hour,
                                edited,
                                "break_start_time",
                                DEFAULT_BREAK_START
                              )
                            : ""
                        }
                        disabled={
                          !breakEnabled ||
                          isLoading
                        }
                        onChange={(event) =>
                          handleChange(
                            hour.id,
                            "break_start_time",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label className="businessHoursManager__field">
                      <span>Fin</span>

                      <input
                        type="time"
                        value={
                          breakEnabled
                            ? getBreakValue(
                                hour,
                                edited,
                                "break_end_time",
                                DEFAULT_BREAK_END
                              )
                            : ""
                        }
                        disabled={
                          !breakEnabled ||
                          isLoading
                        }
                        onChange={(event) =>
                          handleChange(
                            hour.id,
                            "break_end_time",
                            event.target.value
                          )
                        }
                      />
                    </label>

                  </div>

                </div>

                <div className="businessHoursManager__actions">
                  {wasSaved && (
                    <span className="businessHoursManager__saved">
                      Guardado
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn btn--primary businessHoursManager__saveButton"
                    disabled={isLoading}
                    onClick={() =>
                      handleSave(hour)
                    }
                  >
                    {isLoading
                      ? "Guardando..."
                      : "Guardar"}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <p className="businessHoursManager__empty">
            No hay horarios cargados.
          </p>
        )}

      </div>
    </div>
  );
}