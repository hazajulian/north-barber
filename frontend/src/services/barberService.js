// barberService.js
// Centraliza las peticiones relacionadas con los barberos.

import { apiRequest } from "./api";

/* Consultas */

export function getBarbers() {
  return apiRequest("/barbers");
}

export function getBarber(id) {
  return apiRequest(`/barbers/${id}`);
}

export function getAdminBarbers() {
  return apiRequest("/barbers/admin");
}

/* Creación */

export function createBarber(barber) {
  return apiRequest("/barbers", {
    method: "POST",
    body: barber,
  });
}

/* Actualización */

export function updateBarber(id, barber) {
  return apiRequest(`/barbers/${id}`, {
    method: "PUT",
    body: barber,
  });
}

/* Activar / Desactivar */

export function toggleBarber(id) {
  return apiRequest(`/barbers/${id}/toggle`, {
    method: "PATCH",
  });
}

/* Eliminación definitiva */

export function deleteBarber(id) {
  return apiRequest(
    `/barbers/${id}/permanent`,
    {
      method: "DELETE",
    }
  );
}