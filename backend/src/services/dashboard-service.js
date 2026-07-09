// services/dashboard-service.js
// Gestiona la logica del resumen del panel administrador.

import {
  getDashboardRevenue,
  getDashboardStats,
  getLatestAppointments,
  getLatestNotifications,
  getUpcomingAppointments,
} from "../models/dashboard-model.js";

export async function getDashboardSummary() {
  const [
    stats,
    upcomingAppointments,
    latestAppointments,
    latestNotifications,
  ] = await Promise.all([
    getDashboardStats(),
    getUpcomingAppointments(),
    getLatestAppointments(),
    getLatestNotifications(),
  ]);

  return {
    stats,
    upcomingAppointments,
    latestAppointments,
    latestNotifications,
  };
}

export async function getDashboardRevenueSummary(
  period = "month"
) {
  return getDashboardRevenue(period);
}