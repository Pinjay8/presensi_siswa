import { lang } from "@/core/libs";
import { z } from "zod";

export const ekstrakurikulerCreateSchema = z.object({
  nama: z.string().min(1, {
    message: lang.text("fieldIsRequired", { field: lang.text("course") }),
  }),
  jenis: z.string(),
  pembinaId: z.number(),
  deskripsi: z.string().optional(),
  lokasi: z.string().optional(),
  thumbnail: z.any().optional(),
  kontak: z.string().optional(),
});
