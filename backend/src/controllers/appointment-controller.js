// controllers/appointment-controller.js
// Controla las peticiones relacionadas con las reservas.

import {
  changeAppointmentStatus,
  createNewAppointment,
  getAppointmentDetail,
  getAppointments,
  getAppointmentStats,
} from "../services/appointment-service.js";

import { getAvailableSlots } from "../services/availability-service.js";
import { sendSuccess } from "../utils/response.js";

export async function listAppointments(req, res, next) {
  try {
    const appointments = await getAppointments();

    return sendSuccess(
      res,
      "Appointments retrieved successfully",
      appointments
    );
  } catch (error) {
    next(error);
  }
}

export async function getAppointment(req, res, next) {
  try {
    const appointment = await getAppointmentDetail(
      req.params.id
    );

    return sendSuccess(
      res,
      "Appointment retrieved successfully",
      appointment
    );
  } catch (error) {
    next(error);
  }
}

// Obtiene las estadísticas del dashboard.
export async function getAppointmentStatsController(
  req,
  res,
  next
) {
  try {
    const stats = await getAppointmentStats();

    return sendSuccess(
      res,
      "Appointment statistics retrieved successfully",
      stats
    );
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const appointment = await createNewAppointment(
      req.body
    );

    return sendSuccess(
      res,
      "Appointment created successfully",
      appointment,
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentStatusController(
  req,
  res,
  next
) {
  try {
    const {
      status,
      sendEmail,
      customMessage,
    } = req.body;

    const result =
      await changeAppointmentStatus(
        req.params.id,
        status,
        {
          sendEmail,
          customMessage,
        },
        req.user.id
      );

    return sendSuccess(
      res,
      "Appointment status updated successfully",
      result
    );
  } catch (error) {
    next(error);
  }
}

export async function listAvailableSlots(
  req,
  res,
  next
) {
  try {
    const {
      barberId,
      serviceId,
      date,
    } = req.validatedQuery;

    const slots = await getAvailableSlots(
      barberId ? Number(barberId) : null,
      Number(serviceId),
      date
    );

    return sendSuccess(
      res,
      "Available slots retrieved successfully",
      slots
    );
  } catch (error) {
    next(error);
  }
}