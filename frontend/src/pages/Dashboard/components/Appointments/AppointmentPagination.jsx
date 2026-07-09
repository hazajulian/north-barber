// AppointmentPagination.jsx
// Paginación reutilizable para el listado de reservas.

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

import "./AppointmentPagination.css";

export function AppointmentPagination({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 15,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const firstItem = (page - 1) * pageSize + 1;

  const lastItem = Math.min(
    page * pageSize,
    totalItems
  );

  function changePage(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    onPageChange(nextPage);
  }

  return (
    <div className="appointmentPagination">

      <div className="appointmentPagination__info">
        Mostrando{" "}
        <strong>
          {firstItem} - {lastItem}
        </strong>{" "}
        de{" "}
        <strong>
          {totalItems}
        </strong>{" "}
        reservas
      </div>

      <div className="appointmentPagination__controls">

        <button
          type="button"
          onClick={() => changePage(1)}
          disabled={page === 1}
          aria-label="Primera página"
        >
          <FaAngleDoubleLeft />
        </button>

        <button
          type="button"
          onClick={() =>
            changePage(page - 1)
          }
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <FaAngleLeft />
        </button>

        <span className="appointmentPagination__current">
          Página {page} de {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            changePage(page + 1)
          }
          disabled={page === totalPages}
          aria-label="Página siguiente"
        >
          <FaAngleRight />
        </button>

        <button
          type="button"
          onClick={() =>
            changePage(totalPages)
          }
          disabled={page === totalPages}
          aria-label="Última página"
        >
          <FaAngleDoubleRight />
        </button>

      </div>

    </div>
  );
}