// getImageUrl.js
// Arma URLs completas para imágenes servidas desde el backend.

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1";

const BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export function getImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  // Si ya viene una URL completa.
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // Asegura que exista una sola "/"
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${BACKEND_URL}${normalizedPath}`;
}