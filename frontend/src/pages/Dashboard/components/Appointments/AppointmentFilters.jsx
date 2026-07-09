// AppointmentFilters.jsx
// Filtros del listado de reservas.
// Permite buscar, filtrar, ordenar y definir la cantidad de registros por página.

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import "./AppointmentFilters.css";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pendientes",
  },
  {
    value: "confirmed",
    label: "Confirmadas",
  },
  {
    value: "completed",
    label: "Completadas",
  },
  {
    value: "cancelled",
    label: "Canceladas",
  },
  {
    value: "all",
    label: "Todas",
  },
];

const PERIOD_OPTIONS = [
  {
    value: "today",
    label: "Hoy",
  },
  {
    value: "upcoming",
    label: "Próximas",
  },
  {
    value: "week",
    label: "Esta semana",
  },
  {
    value: "history",
    label: "Historial",
  },
];

const SORT_OPTIONS = [
  {
    value: "time",
    label: "Horario",
  },
  {
    value: "recent",
    label: "Más recientes",
  },
  {
    value: "oldest",
    label: "Más antiguas",
  },
  {
    value: "customerAsc",
    label: "Cliente A-Z",
  },
  {
    value: "customerDesc",
    label: "Cliente Z-A",
  },
];

const PAGE_SIZE_OPTIONS = [
  {
    value: 15,
    label: "15 reservas",
  },
  {
    value: 20,
    label: "20 reservas",
  },
  {
    value: 30,
    label: "30 reservas",
  },
  {
    value: 50,
    label: "50 reservas",
  },
];

function getOptionLabel(options, value) {
  return (
    options.find((option) => option.value === value)
      ?.label || options[0].label
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div
      className="appointmentFilters__field"
      ref={dropdownRef}
    >
      <span>{label}</span>

      <div
        className={
          open
            ? "appointmentFilters__dropdown appointmentFilters__dropdown--open"
            : "appointmentFilters__dropdown"
        }
      >
        <button
          type="button"
          className="appointmentFilters__trigger"
          onClick={() => setOpen((current) => !current)}
        >
          <span>
            {getOptionLabel(options, value)}
          </span>

          <FaChevronDown />
        </button>

        {open && (
          <div className="appointmentFilters__menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  option.value === value
                    ? "appointmentFilters__option appointmentFilters__option--active"
                    : "appointmentFilters__option"
                }
                onClick={() =>
                  handleSelect(option.value)
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AppointmentFilters({
  search,
  statusFilter,
  periodFilter,
  sortBy,
  pageSize,

  onSearchChange,
  onStatusFilterChange,
  onPeriodFilterChange,
  onSortChange,
  onPageSizeChange,
}) {
  return (
    <section className="appointmentFilters">

      {/* Buscador */}

      <div className="appointmentFilters__search">

        <label>
          Buscar reserva
        </label>

        <input
          type="search"
          value={search}
          placeholder="Cliente, email, teléfono, servicio o barbero..."
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />

      </div>

      {/* Filtros */}

      <div className="appointmentFilters__grid">

        <FilterDropdown
          label="Estado"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={onStatusFilterChange}
        />

        <FilterDropdown
          label="Período"
          value={periodFilter}
          options={PERIOD_OPTIONS}
          onChange={onPeriodFilterChange}
        />

        <FilterDropdown
          label="Ordenar por"
          value={sortBy}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />

        <FilterDropdown
          label="Mostrar"
          value={pageSize}
          options={PAGE_SIZE_OPTIONS}
          onChange={(value) =>
            onPageSizeChange(Number(value))
          }
        />

      </div>

    </section>
  );
}