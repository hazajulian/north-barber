// serviceService.js
// Centraliza las peticiones relacionadas con los servicios.

import { apiRequest } from "./api";

export function getServices() {
  return apiRequest("/services");
}

export function getService(id) {
  return apiRequest(`/services/${id}`);
}

export function getAdminServices() {
  return apiRequest("/services/admin");
}

export function createService(service) {
  return apiRequest("/services", {
    method: "POST",
    body: service,
  });
}

export function updateService(
  id,
  service
) {
  return apiRequest(`/services/${id}`, {
    method: "PUT",
    body: service,
  });
}

export function deleteService(id) {
  return apiRequest(`/services/${id}`, {
    method: "DELETE",
  });
}