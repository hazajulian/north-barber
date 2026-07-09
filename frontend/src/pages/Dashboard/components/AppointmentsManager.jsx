// AppointmentsManager.jsx
// Administra las reservas y permite cambiar su estado.

import { useEffect, useMemo, useState } from "react";

import { updateAppointmentStatus } from "../../../services/appointmentService";

import { AppointmentFilters } from "./Appointments/AppointmentFilters";
import { AppointmentPagination } from "./Appointments/AppointmentPagination";
import { AppointmentStats } from "./Appointments/AppointmentStats";
import { AppointmentStatusBadge } from "./Appointments/AppointmentStatusBadge";
import { AppointmentStatusModal } from "./Appointments/AppointmentStatusModal";

import "./AppointmentsManager.css";

const STORAGE_KEY = "northBarberAppointmentFilters";

const EMPTY_STATS = {
  today: 0,
  upcoming: 0,
  completedMonth: 0,
  revenueMonth: 0,
};

const EMPTY_MODAL_RESULT = {
  visible: false,
  success: false,
  title: "",
  message: "",
};

function getAppointmentId(appointment) {
  return appointment.id || appointment.appointment_id;
}

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

function normalizeDate(date) {
  if (!date) return "";

  return String(date).slice(0, 10);
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getAppointmentSearchText(appointment) {
  return [
    appointment.customer_name,
    appointment.customer_email,
    appointment.customer_phone,
    appointment.service_name,
    appointment.barber_name,
    appointment.comment,
    appointment.notes,
    appointment.customer_comment,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isThisWeek(date) {
  if (!date) return false;

  const target = new Date(`${normalizeDate(date)}T00:00:00`);
  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return target >= start && target < end;
}

function compareByDate(firstAppointment, secondAppointment) {
  const firstDate = normalizeDate(firstAppointment.appointment_date);
  const secondDate = normalizeDate(secondAppointment.appointment_date);

  const firstTime = formatTime(firstAppointment.start_time);
  const secondTime = formatTime(secondAppointment.start_time);

  return `${firstDate} ${firstTime}`.localeCompare(
    `${secondDate} ${secondTime}`
  );
}

function getInitialFilters() {
  const fallback = {
    search: "",
    statusFilter: "pending",
    periodFilter: "all",
    sortBy: "time",
    pageSize: 15,
  };

  try {
    const savedFilters = localStorage.getItem(STORAGE_KEY);

    if (!savedFilters) {
      return fallback;
    }

    const parsedFilters = JSON.parse(savedFilters);

    return {
      ...fallback,
      ...parsedFilters,
      statusFilter:
        parsedFilters.statusFilter === "active"
          ? "pending"
          : parsedFilters.statusFilter,
    };
  } catch {
    return fallback;
  }
}

function getEmailResult(response) {
  return (
    response?.email ||
    response?.data?.email ||
    response?.appointment?.email ||
    null
  );
}

function getStatusTitle(status) {
  if (status === "cancelled") {
    return "Reserva cancelada";
  }

  if (status === "confirmed") {
    return "Reserva confirmada";
  }

  if (status === "completed") {
    return "Reserva completada";
  }

  return "Reserva actualizada";
}

function getSuccessMessage(statusData, response) {
  const email = getEmailResult(response);

  if (statusData.status === "cancelled") {
    if (email?.skipped) {
      return "La reserva fue cancelada correctamente. No se envió correo al cliente.";
    }

    if (email?.sent === false) {
      return "La reserva fue cancelada, pero no se pudo enviar el correo al cliente.";
    }

    if (email?.sent === true) {
      return "La reserva fue cancelada correctamente y se envió el correo al cliente.";
    }

    return "La reserva fue cancelada correctamente.";
  }

  if (statusData.status === "confirmed") {
    if (email?.sent === false) {
      return "La reserva fue confirmada, pero no se pudo enviar el correo al cliente.";
    }

    if (email?.sent === true) {
      return "La reserva fue confirmada correctamente y se notificó al cliente.";
    }

    return "La reserva fue confirmada correctamente.";
  }

  if (statusData.status === "completed") {
    return "La reserva fue marcada como completada correctamente.";
  }

  return "La reserva fue actualizada correctamente.";
}

function getErrorMessage(error) {
  return (
    error.message ||
    "No se pudo actualizar la reserva. Revisá la conexión e intentá nuevamente."
  );
}

export function AppointmentsManager({
  appointments = [],
  stats = EMPTY_STATS,
  onRefresh,
}) {
  const initialFilters = getInitialFilters();

  const [loading, setLoading] = useState(false);
  const [modalResult, setModalResult] = useState(
    EMPTY_MODAL_RESULT
  );

  const [search, setSearch] = useState(initialFilters.search);
  const [statusFilter, setStatusFilter] = useState(
    initialFilters.statusFilter
  );
  const [periodFilter, setPeriodFilter] = useState(
    initialFilters.periodFilter
  );
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [pageSize, setPageSize] = useState(
    initialFilters.pageSize
  );
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const appointmentStats = useMemo(() => {
    return {
      ...EMPTY_STATS,
      ...stats,
    };
  }, [stats]);

  const filteredAppointments = useMemo(() => {
    const today = getTodayDate();
    const searchValue = search.trim().toLowerCase();

    return appointments
      .filter((appointment) => {
        const status = appointment.status || "pending";
        const date = normalizeDate(
          appointment.appointment_date
        );

        const matchesStatus =
          statusFilter === "all" ||
          status === statusFilter;

        const shouldIgnorePeriod =
          statusFilter === "pending";

        const matchesPeriod =
          shouldIgnorePeriod ||
          periodFilter === "all" ||
          (periodFilter === "today" && date === today) ||
          (periodFilter === "upcoming" &&
            date >= today &&
            ["pending", "confirmed"].includes(status)) ||
          (periodFilter === "week" && isThisWeek(date)) ||
          (periodFilter === "history" &&
            (date < today ||
              ["cancelled", "completed"].includes(status)));

        const matchesSearch =
          !searchValue ||
          getAppointmentSearchText(appointment).includes(
            searchValue
          );

        return (
          matchesStatus &&
          matchesPeriod &&
          matchesSearch
        );
      })
      .sort((firstAppointment, secondAppointment) => {
        if (sortBy === "oldest") {
          return compareByDate(
            firstAppointment,
            secondAppointment
          );
        }

        if (sortBy === "recent") {
          return compareByDate(
            secondAppointment,
            firstAppointment
          );
        }
              if (sortBy === "customerAsc") {
          return String(
            firstAppointment.customer_name || ""
          ).localeCompare(
            String(secondAppointment.customer_name || ""),
            "es"
          );
        }

        if (sortBy === "customerDesc") {
          return String(
            secondAppointment.customer_name || ""
          ).localeCompare(
            String(firstAppointment.customer_name || ""),
            "es"
          );
        }

        return compareByDate(
          firstAppointment,
          secondAppointment
        );
      });
  }, [
    appointments,
    search,
    statusFilter,
    periodFilter,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / pageSize)
  );

  const paginatedAppointments = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAppointments.slice(
      start,
      start + pageSize
    );
  }, [
    filteredAppointments,
    page,
    pageSize,
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        search,
        statusFilter,
        periodFilter,
        sortBy,
        pageSize,
      })
    );
  }, [
    search,
    statusFilter,
    periodFilter,
    sortBy,
    pageSize,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    statusFilter,
    periodFilter,
    sortBy,
    pageSize,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function openStatusModal(appointment) {
    setSelectedAppointment(appointment);
    setModalResult(EMPTY_MODAL_RESULT);
    setModalOpen(true);
  }

  function closeStatusModal() {
    if (loading) return;

    setModalResult(EMPTY_MODAL_RESULT);
    setModalOpen(false);
    setSelectedAppointment(null);
  }

  function closeSuccessModal() {
    setModalResult(EMPTY_MODAL_RESULT);
    setModalOpen(false);
    setSelectedAppointment(null);
  }

  async function handleStatusUpdate(statusData) {
    if (!selectedAppointment) {
      return;
    }

    try {
      setLoading(true);
      setModalResult(EMPTY_MODAL_RESULT);

      const response =
        await updateAppointmentStatus(
          getAppointmentId(selectedAppointment),
          statusData
        );

      const message =
        getSuccessMessage(
          statusData,
          response
        );

      setModalResult({
        visible: true,
        success: true,
        title: getStatusTitle(statusData.status),
        message,
      });

      if (onRefresh) {
        await onRefresh();
      }

      setTimeout(() => {
        closeSuccessModal();
      }, 2200);
    } catch (error) {
      setModalResult({
        visible: true,
        success: false,
        title: "No se pudo actualizar",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="appointmentsManager">

        <AppointmentStats
          stats={appointmentStats}
        />

        <AppointmentFilters
          search={search}
          statusFilter={statusFilter}
          periodFilter={periodFilter}
          sortBy={sortBy}
          pageSize={pageSize}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onPeriodFilterChange={
            setPeriodFilter
          }
          onSortChange={setSortBy}
          onPageSizeChange={setPageSize}
        />

        <div className="appointmentsManager__tableWrapper">

          <table className="appointmentsManager__table">

            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Barbero</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map(
                  (appointment) => {
                    const id =
                      getAppointmentId(
                        appointment
                      );

                    const status =
                      appointment.status ||
                      "pending";

                    const isClosed =
                      status ===
                        "completed" ||
                      status ===
                        "cancelled";

                    return (
                      <tr key={id}>

                        <td>
                          <strong>
                            {appointment.customer_name ||
                              "-"}
                          </strong>

                          <span>
                            {appointment.customer_email ||
                              "Sin email"}
                          </span>

                          {appointment.customer_phone && (
                            <span>
                              {
                                appointment.customer_phone
                              }
                            </span>
                          )}
                        </td>

                        <td>
                          {appointment.service_name ||
                            "-"}
                        </td>

                        <td>
                          {appointment.barber_name ||
                            "-"}
                        </td>

                        <td>
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </td>

                        <td>
                          {formatTime(
                            appointment.start_time
                          )}

                          {appointment.end_time
                            ? ` - ${formatTime(
                                appointment.end_time
                              )}`
                            : ""}
                        </td>

                        <td>
                          <AppointmentStatusBadge
                            status={status}
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            className="appointmentsManager__statusButton"
                            disabled={isClosed}
                            onClick={() =>
                              openStatusModal(
                                appointment
                              )
                            }
                          >
                            Cambiar estado
                          </button>
                        </td>

                      </tr>
                    );
                  }
                )
              ) : (
                <tr>

                  <td
                    colSpan="7"
                    className="appointmentsManager__empty"
                  >
                    No hay reservas para mostrar con los filtros actuales.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        <AppointmentPagination
          page={page}
          totalPages={totalPages}
          totalItems={
            filteredAppointments.length
          }
          pageSize={pageSize}
          onPageChange={setPage}
        />

      </div>

      <AppointmentStatusModal
        open={modalOpen}
        loading={loading}
        appointment={selectedAppointment}
        result={modalResult}
        onCancel={closeStatusModal}
        onConfirm={handleStatusUpdate}
      />
    </>
  );
}