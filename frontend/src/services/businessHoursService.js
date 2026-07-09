// businessHoursService.js
// Centraliza las peticiones relacionadas con los horarios del negocio.

import { apiRequest } from "./api";

export function getBusinessHours() {
  return apiRequest("/business-hours");
}

export function updateBusinessHours(id, businessHours) {
  return apiRequest(`/business-hours/${id}`, {
    method: "PUT",
    body: businessHours,
  });
}