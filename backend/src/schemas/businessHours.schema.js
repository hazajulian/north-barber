// schemas/businessHours.schema.js
// Define las validaciones para actualizar horarios del negocio.

import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const updateBusinessHoursSchema = z
  .object({
    open_time: z
      .string()
      .regex(
        timeRegex,
        "Open time must use HH:mm or HH:mm:ss format"
      ),

    close_time: z
      .string()
      .regex(
        timeRegex,
        "Close time must use HH:mm or HH:mm:ss format"
      ),

    is_open: z.boolean(),

    has_break: z.boolean().optional().default(false),

    break_start_time: z
      .string()
      .regex(
        timeRegex,
        "Break start time must use HH:mm or HH:mm:ss format"
      )
      .nullable()
      .optional(),

    break_end_time: z
      .string()
      .regex(
        timeRegex,
        "Break end time must use HH:mm or HH:mm:ss format"
      )
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.open_time >= data.close_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["close_time"],
        message:
          "Close time must be later than open time",
      });
    }

    if (!data.has_break) {
      return;
    }

    if (!data.break_start_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["break_start_time"],
        message:
          "Break start time is required when break is enabled",
      });
    }

    if (!data.break_end_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["break_end_time"],
        message:
          "Break end time is required when break is enabled",
      });
    }

    if (
      data.break_start_time &&
      data.break_end_time &&
      data.break_start_time >= data.break_end_time
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["break_end_time"],
        message:
          "Break end time must be later than break start time",
      });
    }

    if (
      data.break_start_time &&
      data.break_start_time <= data.open_time
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["break_start_time"],
        message:
          "Break start time must be later than open time",
      });
    }

    if (
      data.break_end_time &&
      data.break_end_time >= data.close_time
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["break_end_time"],
        message:
          "Break end time must be earlier than close time",
      });
    }
  });