// schemas/availability.schema.js
// Define las validaciones para consultar turnos disponibles.

import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const availabilityQuerySchema = z.object({
  barberId: z.coerce
    .number()
    .int("Barber ID must be an integer")
    .positive("Barber ID must be positive")
    .optional(),

  serviceId: z.coerce
    .number()
    .int("Service ID must be an integer")
    .positive("Service ID must be positive"),

  date: z
    .string()
    .trim()
    .regex(dateRegex, "Date must use YYYY-MM-DD format"),
});