// utils/date.js
// Centraliza utilidades simples para trabajar con fechas.

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function isPastDate(date) {
  const today = getTodayDate();

  return date < today;
}