// formatDate.js
// Formatea fechas para mostrar al usuario.

export function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatInputDate(date) {
  if (!date) {
    return "";
  }

  const currentDate = new Date(date);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  return formatInputDate(new Date());
}