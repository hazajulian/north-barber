// services/appointment-service.js
// Gestiona la logica principal para crear y actualizar reservas.

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentStats as getAppointmentStatsModel,
  updateAppointmentStatus,
} from "../models/appointment-model.js";

import { getBarberById } from "../models/barber-model.js";
import { getServiceById } from "../models/service-model.js";

import { getAvailableSlots } from "./availability-service.js";

import {
  sendAppointmentCancellationEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentStatusEmail,
} from "./mail-service.js";

import {
  createAppointmentNotification,
  createStatusNotification,
} from "./notification-service.js";

import { registerAuditLog } from "./audit-service.js";

const VALID_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
};

export async function getAppointments() {
  return getAllAppointments();
}

export async function getAppointmentDetail(id) {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  return appointment;
}

export async function getAppointmentStats() {
  return getAppointmentStatsModel();
}

async function validateService(serviceId) {
  const service = await getServiceById(serviceId);

  if (!service || !service.is_active) {
    const error = new Error("Service not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  return service;
}

async function validateBarber(barberId) {
  const barber = await getBarberById(barberId);

  if (!barber || !barber.is_active) {
    const error = new Error("Barber not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  return barber;
}

function findRequestedSlot(slots, requestedStart) {
  return slots.find((slot) => {
    return slot.start_time === requestedStart;
  });
}

async function resolveAppointmentBarber(appointmentData) {
  const requestedStart = appointmentData.start_time.slice(0, 5);

  if (appointmentData.barber_id) {
    await validateBarber(appointmentData.barber_id);

    const availableSlots = await getAvailableSlots(
      appointmentData.barber_id,
      appointmentData.service_id,
      appointmentData.appointment_date
    );

    const selectedSlot = findRequestedSlot(
      availableSlots,
      requestedStart
    );

    if (!selectedSlot) {
      const error = new Error("Selected time is not available");
      error.statusCode = 409;
      throw error;
    }

    return {
      barberId: appointmentData.barber_id,
      selectedSlot,
    };
  }

  const availableSlots = await getAvailableSlots(
    null,
    appointmentData.service_id,
    appointmentData.appointment_date
  );

  const selectedSlot = findRequestedSlot(
    availableSlots,
    requestedStart
  );

  if (
    !selectedSlot ||
    !selectedSlot.available_barbers ||
    selectedSlot.available_barbers.length === 0
  ) {
    const error = new Error("Selected time is not available");
    error.statusCode = 409;
    throw error;
  }

  const assignedBarber = selectedSlot.available_barbers[0];

  return {
    barberId: assignedBarber.id,
    selectedSlot,
  };
}

export async function createNewAppointment(appointmentData) {
  await validateService(appointmentData.service_id);

  const { barberId, selectedSlot } =
    await resolveAppointmentBarber(appointmentData);

  const appointment = await createAppointment({
    ...appointmentData,
    barber_id: barberId,
    end_time: selectedSlot.end_time,
  });

  await registerAuditLog({
    action: "create_appointment",
    entity: "appointment",
    entityId: appointment.id,
    description: `Se creo una reserva para ${appointment.customer_name}.`,
  });

  try {
    await createAppointmentNotification(appointment);
  } catch (error) {
    console.error("Failed to create appointment notification.");
    console.error(error.message);
  }

  return appointment;
}

function validateStatusChange(currentStatus, newStatus) {
  if (currentStatus === newStatus) {
    const error = new Error(
      "Appointment already has this status"
    );
    error.statusCode = 409;
    throw error;
  }

  const allowedStatuses =
    VALID_STATUS_TRANSITIONS[currentStatus] || [];

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error(
      `Cannot change appointment from ${currentStatus} to ${newStatus}`
    );
    error.statusCode = 409;
    throw error;
  }
}

async function sendStatusEmailSafely(
  appointment,
  status,
  options
) {
  const email = {
    attempted: false,
    sent: false,
    skipped: false,
    error: null,
  };

  if (
    status === "cancelled" &&
    options.sendEmail === false
  ) {
    email.skipped = true;
    return email;
  }

  try {
    email.attempted = true;

    if (status === "confirmed") {
      await sendAppointmentConfirmationEmail(appointment);
    } else if (status === "cancelled") {
      await sendAppointmentCancellationEmail(appointment, {
        sendEmail: true,
        customMessage: options.customMessage,
      });
    } else {
      await sendAppointmentStatusEmail(appointment);
    }

    email.sent = true;
  } catch (error) {
    console.error(
      "Failed to send appointment status email."
    );
    console.error(error.message);

    email.error = error.message;
  }

  return email;
}

export async function changeAppointmentStatus(
  id,
  status,
  options = {},
  userId = null
) {
  const appointment = await getAppointmentDetail(id);

  validateStatusChange(appointment.status, status);

  const updatedAppointment = await updateAppointmentStatus(
    id,
    status
  );

  await registerAuditLog({
    userId,
    action: "update_appointment_status",
    entity: "appointment",
    entityId: updatedAppointment.id,
    description: `La reserva de ${updatedAppointment.customer_name} fue marcada como ${status}.`,
  });

  try {
    await createStatusNotification(
      updatedAppointment,
      status
    );
  } catch (error) {
    console.error(
      "Failed to create status notification."
    );
    console.error(error.message);
  }

  const email = await sendStatusEmailSafely(
    updatedAppointment,
    status,
    options
  );

  return {
    appointment: updatedAppointment,
    email,
  };
}