import { lang } from "@/core/libs";
import { z } from "zod";

export const courseCreateSchema = z.object({
  namaMataPelajaran: z.string().min(1, {
    message: lang.text("fieldIsRequired", {
      field: lang.text("course"),
    }),
  }),

  kode: z.string().max(16).optional(),

  kelompok: z.string().default("").optional(),

  kelas: z
    .array(
      z.object({
        kelasId: z.coerce.number().optional(),
        guruId: z.coerce.number().optional(),
      }),
    )
    .default([]),
});
