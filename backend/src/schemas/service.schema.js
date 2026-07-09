// schemas/service.schema.js
// Define las validaciones para crear y editar servicios.

import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must have at least 2 characters")
    .max(100, "Name must have less than 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must have less than 1000 characters")
    .optional()
    .nullable(),

  duration_minutes: z.coerce
    .number()
    .int("Duration must be an integer")
    .min(5, "Duration must be at least 5 minutes")
    .max(240, "Duration must be less than 240 minutes"),

  price: z.coerce
    .number()
    .min(0, "Price must be greater than or equal to 0"),
});

export const updateServiceSchema = createServiceSchema.extend({
  is_active: z.boolean(),
});