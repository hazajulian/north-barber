// appointmentService.js
// Centraliza todas las peticiones relacionadas con reservas.

import { apiRequest } from "./api";

export function getAppointments() {
  return apiRequest("/appointments");
}

export function getAppointment(id) {
  return apiRequest(`/appointments/${id}`);
}

export function getAppointmentStats() {
  return apiRequest("/appointments/stats");
}

export function getAvailableSlots(
  barberId,
  serviceId,
  date
) {
  const params = new URLSearchParams();

  if (barberId) {
    params.append("barberId", barberId);
  }

  params.append("serviceId", serviceId);
  params.append("date", date);

  return apiRequest(
    `/appointments/availability?${params.toString()}`
  );
}

export function createAppointment(
  appointment
) {
  return apiRequest("/appointments", {
    method: "POST",
    body: appointment,
  });
}

export function updateAppointmentStatus(
  id,
  statusData
) {
  return apiRequest(
    `/appointments/${id}/status`,
    {
      method: "PATCH",
      body: statusData,
    }
  );
}