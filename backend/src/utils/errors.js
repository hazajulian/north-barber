// utils/errors.js
// Centraliza la creacion de errores HTTP reutilizables.

export function createHttpError(message, statusCode = 500) {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
}

export function badRequest(message = "Bad request") {
  return createHttpError(message, 400);
}

export function unauthorized(message = "Unauthorized") {
  return createHttpError(message, 401);
}

export function forbidden(message = "Forbidden") {
  return createHttpError(message, 403);
}

export function notFound(message = "Resource not found") {
  return createHttpError(message, 404);
}

export function conflict(message = "Conflict") {
  return createHttpError(message, 409);
}