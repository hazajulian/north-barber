// TimeSlots.jsx
// Muestra los horarios disponibles para la fecha, servicio y barbero seleccionados.

import "./TimeSlots.css";

function getSlotTime(slot) {
  return slot?.start_time || slot?.time || slot;
}

function getAvailableBarbersCount(slot) {
  if (!slot?.available_barbers) {
    return null;
  }

  return slot.available_barbers.length;
}

function getDayPeriod(time) {
  const hour = Number(String(time).slice(0, 2));

  if (hour < 12) {
    return "morning";
  }

  if (hour < 17) {
    return "afternoon";
  }

  return "evening";
}

function getAvailabilityText(count) {
  if (!count) {
    return "Disponible";
  }

  if (count === 1) {
    return "Último lugar";
  }

  return `${count} barberos`;
}

const PERIODS = [
  {
    key: "morning",
    label: "Mañana",
  },
  {
    key: "afternoon",
    label: "Tarde",
  },
  {
    key: "evening",
    label: "Noche",
  },
];

export function TimeSlots({
  slots,
  selectedTime,
  loading,
  onSelectTime,
}) {
  const groupedSlots = PERIODS.map((period) => {
    return {
      ...period,
      slots: slots.filter((slot) => {
        const time = getSlotTime(slot);
        return getDayPeriod(time) === period.key;
      }),
    };
  }).filter((period) => period.slots.length > 0);

  return (
    <section className="timeSlots">
      <div className="timeSlots__header">
        <span className="eyebrow">Horario</span>

        <h2 className="timeSlots__title">
          Elegí un horario
        </h2>

        <p className="timeSlots__text">
          Los horarios se actualizan según el servicio, el barbero elegido y la disponibilidad real.
        </p>
      </div>

      {loading ? (
        <div className="timeSlots__message">
          <span className="timeSlots__loader" />
          Buscando horarios disponibles...
        </div>
      ) : groupedSlots.length > 0 ? (
        <div className="timeSlots__groups">
          {groupedSlots.map((group) => (
            <div
              key={group.key}
              className="timeSlots__group"
            >
              <div className="timeSlots__groupHeader">
                <h3>{group.label}</h3>
                <span>{group.slots.length} horarios</span>
              </div>

              <div className="timeSlots__grid">
                {group.slots.map((slot) => {
                  const time = getSlotTime(slot);
                  const isSelected = selectedTime === time;
                  const barbersCount =
                    getAvailableBarbersCount(slot);

                  return (
                    <button
                      type="button"
                      key={time}
                      className={
                        isSelected
                          ? "timeSlots__button timeSlots__button--active"
                          : "timeSlots__button"
                      }
                      onClick={() => onSelectTime(time)}
                    >
                      <strong>{time}</strong>

                      <span>
                        {getAvailabilityText(
                          barbersCount
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="timeSlots__message">
          Elegí servicio, barbero y día para ver los horarios disponibles.
        </p>
      )}
    </section>
  );
}