// dashboardService.js
// Centraliza las peticiones relacionadas con el resumen del dashboard.

import { apiRequest } from "./api";

export function getDashboardSummary() {
  return apiRequest("/dashboard");
}

export function getDashboardRevenue(
  period = "month"
) {
  const params = new URLSearchParams({
    period,
  });

  return apiRequest(
    `/dashboard/revenue?${params.toString()}`
  );
}