// services/availability-service.js
// Calcula disponibilidad de turnos segun horario, descanso, servicio, barberos y reservas existentes.

import { getBusinessHoursByDay } from "../models/businessHours-model.js";
import { getAppointmentsByBarberAndDate } from "../models/appointment-model.js";
import { getActiveBarbers } from "../models/barber-model.js";
import { getServiceById } from "../models/service-model.js";

import { isPastDate } from "../utils/date.js";
import {
  minutesToTime,
  timeToMinutes,
} from "../utils/time.js";

function getDayOfWeek(date) {
  return new Date(`${date}T00:00:00`).getDay();
}

function hasAppointmentConflict(
  slotStart,
  slotEnd,
  appointments
) {
  return appointments.some((appointment) => {
    const appointmentStart = timeToMinutes(
      appointment.start_time
    );

    const appointmentEnd = timeToMinutes(
      appointment.end_time
    );

    return (
      slotStart < appointmentEnd &&
      slotEnd > appointmentStart
    );
  });
}

function hasBreakConflict(
  slotStart,
  slotEnd,
  businessHours
) {
  if (
    !businessHours.has_break ||
    !businessHours.break_start_time ||
    !businessHours.break_end_time
  ) {
    return false;
  }

  const breakStart = timeToMinutes(
    businessHours.break_start_time
  );

  const breakEnd = timeToMinutes(
    businessHours.break_end_time
  );

  return (
    slotStart < breakEnd &&
    slotEnd > breakStart
  );
}

async function getSlotsForBarber(
  barber,
  service,
  businessHours,
  appointmentDate
) {
  const appointments =
    await getAppointmentsByBarberAndDate(
      barber.id,
      appointmentDate
    );

  const slots = [];
  const duration = service.duration_minutes;

  const openMinutes = timeToMinutes(
    businessHours.open_time
  );

  const closeMinutes = timeToMinutes(
    businessHours.close_time
  );

  for (
    let start = openMinutes;
    start + duration <= closeMinutes;
    start += duration
  ) {
    const end = start + duration;

    const appointmentConflict =
      hasAppointmentConflict(
        start,
        end,
        appointments
      );

    const breakConflict =
      hasBreakConflict(
        start,
        end,
        businessHours
      );

    if (!appointmentConflict && !breakConflict) {
      slots.push({
        start_time: minutesToTime(start),
        end_time: minutesToTime(end),
        barber_id: barber.id,
        barber_name: barber.name,
      });
    }
  }

  return slots;
}

function groupSlotsByTime(slots) {
  const groupedSlots = new Map();

  slots.forEach((slot) => {
    const key = slot.start_time;

    if (!groupedSlots.has(key)) {
      groupedSlots.set(key, {
        start_time: slot.start_time,
        end_time: slot.end_time,
        available_barbers: [],
      });
    }

    groupedSlots.get(key).available_barbers.push({
      id: slot.barber_id,
      name: slot.barber_name,
    });
  });

  return Array.from(groupedSlots.values()).sort(
    (a, b) => a.start_time.localeCompare(b.start_time)
  );
}

export async function getAvailableSlots(
  barberId,
  serviceId,
  appointmentDate
) {
  if (isPastDate(appointmentDate)) {
    return [];
  }

  const service = await getServiceById(serviceId);

  if (!service || !service.is_active) {
    const error = new Error(
      "Service not found or inactive"
    );
    error.statusCode = 404;
    throw error;
  }

  const dayOfWeek = getDayOfWeek(appointmentDate);

  const businessHours =
    await getBusinessHoursByDay(dayOfWeek);

  if (!businessHours || !businessHours.is_open) {
    return [];
  }

  if (barberId) {
    const slots = await getSlotsForBarber(
      {
        id: barberId,
        name: null,
      },
      service,
      businessHours,
      appointmentDate
    );

    return slots.map((slot) => ({
      start_time: slot.start_time,
      end_time: slot.end_time,
    }));
  }

  const activeBarbers = await getActiveBarbers();

  if (activeBarbers.length === 0) {
    return [];
  }

  const allSlots = [];

  for (const barber of activeBarbers) {
    const barberSlots = await getSlotsForBarber(
      barber,
      service,
      businessHours,
      appointmentDate
    );

    allSlots.push(...barberSlots);
  }

  return groupSlotsByTime(allSlots);
}