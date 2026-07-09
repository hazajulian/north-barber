// formatTime.js
// Formatea horarios para mostrar al usuario.

export function formatTime(time) {
  if (!time) {
    return "";
  }

  return time.slice(0, 5);
}

export function formatTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export function convertMinutesToDuration(minutes) {
  if (!minutes && minutes !== 0) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}