// schemas/barber.schema.js
// Define las validaciones para crear y editar barberos.

import { z } from "zod";

const optionalText = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) return null;
    return value;
  },
  z.string().trim().nullable().optional()
);

const booleanFromFormData = z.preprocess(
  (value) => {
    if (value === true || value === "true" || value === "1") return true;
    if (value === false || value === "false" || value === "0") return false;
    return value;
  },
  z.boolean()
);

export const createBarberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must have at least 2 characters")
    .max(100, "Name must have less than 100 characters"),

  specialty: z
    .string()
    .trim()
    .min(2, "Specialty must have at least 2 characters")
    .max(150, "Specialty must have less than 150 characters"),

  bio: z
    .string()
    .trim()
    .min(2, "Bio must have at least 2 characters")
    .max(1000, "Bio must have less than 1000 characters"),

  email: optionalText,
  phone: optionalText,
});

export const updateBarberSchema = createBarberSchema.extend({
  is_active: booleanFromFormData,
});