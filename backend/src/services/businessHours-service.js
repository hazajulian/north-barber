// services/businessHours-service.js
// Gestiona la logica relacionada con los horarios del negocio.

import {
  getAllBusinessHours,
  updateBusinessHours,
} from "../models/businessHours-model.js";

export async function getBusinessHoursService() {
  return getAllBusinessHours();
}

export async function updateBusinessHoursService(
  id,
  businessHoursData
) {
  const normalizedBusinessHours = {
    ...businessHoursData,

    has_break:
      Boolean(businessHoursData.has_break),

    break_start_time:
      businessHoursData.has_break
        ? businessHoursData.break_start_time
        : null,

    break_end_time:
      businessHoursData.has_break
        ? businessHoursData.break_end_time
        : null,
  };

  const businessHours =
    await updateBusinessHours(
      id,
      normalizedBusinessHours
    );

  if (!businessHours) {
    const error = new Error("Business hours not found");
    error.statusCode = 404;
    throw error;
  }

  return businessHours;
}