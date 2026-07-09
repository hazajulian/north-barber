// DateSelector.jsx
// Permite seleccionar visualmente la fecha de la reserva.

import "./DateSelector.css";

const DAYS_TO_SHOW = 14;

const WEEK_DAYS = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
];

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function formatDateValue(date) {
  return date.toISOString().split("T")[0];
}

function formatSelectedDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  return `${WEEK_DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function isBusinessDayOpen(date, businessHours) {
  if (!businessHours?.length) {
    return true;
  }

  const dayOfWeek = date.getDay();

  const dayConfig = businessHours.find(
    (businessDay) =>
      Number(businessDay.day_of_week) === dayOfWeek
  );

  if (!dayConfig) {
    return false;
  }

  return Boolean(dayConfig.is_open);
}

function createDateOptions(businessHours) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const options = [];
  let index = 0;

  while (options.length < DAYS_TO_SHOW && index < 45) {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    if (isBusinessDayOpen(date, businessHours)) {
      options.push({
        value: formatDateValue(date),
        dayName: WEEK_DAYS[date.getDay()],
        dayNumber: date.getDate(),
        monthName: MONTHS[date.getMonth()],
        label:
          index === 0
            ? "Hoy"
            : index === 1
              ? "Mañana"
              : WEEK_DAYS[date.getDay()],
      });
    }

    index += 1;
  }

  return options;
}

export function DateSelector({
  selectedDate,
  businessHours = [],
  onSelectDate,
}) {
  const dateOptions = createDateOptions(businessHours);

  return (
    <section className="dateSelector">
      <div className="dateSelector__header">
        <span className="eyebrow">
          Paso 3
        </span>

        <h2 className="dateSelector__title">
          Elegí el día
        </h2>

        <p className="dateSelector__text">
          Mostramos solamente los días en los que la barbería atiende.
        </p>
      </div>

      {dateOptions.length > 0 ? (
        <div className="dateSelector__scroller">
          {dateOptions.map((option) => {
            const isSelected =
              selectedDate === option.value;

            return (
              <button
                type="button"
                key={option.value}
                className={
                  isSelected
                    ? "dateSelector__card dateSelector__card--active"
                    : "dateSelector__card"
                }
                onClick={() =>
                  onSelectDate(option.value)
                }
              >
                <span className="dateSelector__label">
                  {option.label}
                </span>

                <span className="dateSelector__number">
                  {option.dayNumber}
                </span>

                <span className="dateSelector__month">
                  {option.monthName}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="dateSelector__empty">
          No hay días disponibles para reservar en este momento.
        </p>
      )}

      {selectedDate && (
        <div className="dateSelector__resume">
          <span>
            Día seleccionado
          </span>

          <strong>
            {formatSelectedDate(
              selectedDate
            )}
          </strong>
        </div>
      )}
    </section>
  );
}