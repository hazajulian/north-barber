// api.js
// Centraliza todas las peticiones HTTP hacia el backend.

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem(
    "north_barber_token"
  );

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

function isFormData(body) {
  return body instanceof FormData;
}

export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    headers = {},
  } = {}
) {
  const normalizedMethod = method.toUpperCase();
  const formDataBody = isFormData(body);

  const requestOptions = {
    method: normalizedMethod,

    headers: {
      ...(!formDataBody && {
        "Content-Type": "application/json",
      }),

      ...getAuthHeaders(),
      ...headers,
    },
  };

  if (
    body !== undefined &&
    normalizedMethod !== "GET"
  ) {
    requestOptions.body = formDataBody
      ? body
      : JSON.stringify(body);
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    requestOptions
  );

  let data = {};

  try {
    if (response.status !== 204) {
      data = await response.json();
    }
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.message ||
        data.error ||
        "Request failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data.data;
}