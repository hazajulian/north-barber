// authService.js
// Centraliza las peticiones relacionadas con autenticación.

import { apiRequest } from "./api";

// Inicia sesión como administrador.
export function loginAdmin(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

// Obtiene el perfil del administrador autenticado.
export function getAdminProfile() {
  return apiRequest("/auth/me");
}

// Actualiza la contraseña del administrador.
export function changeAdminPassword(passwordData) {
  return apiRequest("/auth/change-password", {
    method: "PATCH",
    body: passwordData,
  });
}

// Actualiza el correo del administrador.
export function changeAdminEmail(emailData) {
  return apiRequest("/auth/email", {
    method: "PATCH",
    body: emailData,
  });
}

// Solicita el envío del correo de recuperación.
export function requestAdminPasswordReset(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

// Restablece la contraseña utilizando el token recibido por correo.
export function resetAdminPassword(resetData) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: resetData,
  });
}