// controllers/businessHours-controller.js
// Controla las peticiones relacionadas con los horarios del negocio.

import {
  getBusinessHoursService,
  updateBusinessHoursService,
} from "../services/businessHours-service.js";

import { sendSuccess } from "../utils/response.js";

export async function listBusinessHours(req, res, next) {
  try {
    const businessHours = await getBusinessHoursService();

    return sendSuccess(
      res,
      "Business hours retrieved successfully",
      businessHours
    );
  } catch (error) {
    next(error);
  }
}

export async function editBusinessHours(req, res, next) {
  try {
    const businessHours = await updateBusinessHoursService(
      req.params.id,
      req.body
    );

    return sendSuccess(
      res,
      "Business hours updated successfully",
      businessHours
    );
  } catch (error) {
    next(error);
  }
}