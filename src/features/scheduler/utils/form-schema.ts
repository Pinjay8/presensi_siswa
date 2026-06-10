import { lang } from "@/core/libs";
import { z } from "zod";

const schedulerDaySchema = z.object({
  dayOfWeek: z.number(),
  jamMasuk: z.string().nullable(),
  jamPulang: z.string().nullable(),
});

export const schedulerSchema = z.object({
  name: z.string().min(1, { message: lang.text("fieldIsRequired", { field: lang.text("scheduleName") }) }),
  description: z.string().nullable().optional(),
  type: z.enum(["SISWA", "GURU"], {
    required_error: lang.text("fieldIsRequired", { field: lang.text("scheduleType") }),
  }),
  isDefault: z.boolean().default(false),
  days: z.array(schedulerDaySchema),
});
