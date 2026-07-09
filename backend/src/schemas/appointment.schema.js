// schemas/appointment.schema.js
// Define las validaciones para crear y actualizar reservas.

import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const createAppointmentSchema = z.object({
  barber_id: z.coerce
    .number()
    .int("Barber ID must be an integer")
    .positive("Barber ID must be positive")
    .optional()
    .nullable(),

  service_id: z.coerce
    .number()
    .int("Service ID must be an integer")
    .positive("Service ID must be positive"),

  customer_name: z
    .string()
    .trim()
    .min(2, "Customer name must have at least 2 characters")
    .max(100, "Customer name must have less than 100 characters"),

  customer_email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(150, "Email must have less than 150 characters"),

  customer_phone: z
    .string()
    .trim()
    .max(50, "Phone must have less than 50 characters")
    .optional()
    .nullable(),

  appointment_date: z
    .string()
    .regex(dateRegex, "Appointment date must use YYYY-MM-DD format"),

  start_time: z
    .string()
    .regex(timeRegex, "Start time must use HH:mm or HH:mm:ss format"),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes must have less than 1000 characters")
    .optional()
    .nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),

  sendEmail: z.boolean().optional(),

  customMessage: z
    .string()
    .trim()
    .max(1000, "Custom message must have less than 1000 characters")
    .optional()
    .nullable(),
});