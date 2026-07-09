// controllers/dashboard-controller.js
// Controla las peticiones del panel administrador.

import {
  getDashboardRevenueSummary,
  getDashboardSummary,
} from "../services/dashboard-service.js";

import { sendSuccess } from "../utils/response.js";

export async function getDashboard(req, res, next) {
  try {
    const dashboard = await getDashboardSummary();

    return sendSuccess(
      res,
      "Dashboard retrieved successfully",
      dashboard
    );
  } catch (error) {
    next(error);
  }
}

export async function getDashboardRevenueController(
  req,
  res,
  next
) {
  try {
    const { period = "month" } = req.query;

    const revenue =
      await getDashboardRevenueSummary(period);

    return sendSuccess(
      res,
      "Dashboard revenue retrieved successfully",
      revenue
    );
  } catch (error) {
    next(error);
  }
}