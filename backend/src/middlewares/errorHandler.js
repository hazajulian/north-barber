// errorHandler.js
// Maneja los errores generales de la API.

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
}