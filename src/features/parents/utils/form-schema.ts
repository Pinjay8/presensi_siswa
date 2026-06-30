import { lang } from "@/core/libs";

import { z } from "zod";

export const parentEditSchema = z.object({
  email: z
    .string()
    .min(1, { message: lang.text("emailValidation1") })
    .email({ message: lang.text("emailValidation1") }),
  password: z.string().optional(),
  alamat: z.string().optional(),
  hobi: z.string().optional(),
  name: z.string().min(1, { message: lang.text("schoolCreationValidation1") }),
  jenisKelamin: z.string().optional(),
  tanggalLahir: z.string().optional(),
  role: z.string().optional(),
  rfid: z.string().optional(),
  nisn: z.string().optional(),
  nrk: z.string().optional(),
  nikki: z.string().optional(),
  noTelegram: z.string().optional(),
  image: z.string().optional(),
  nis: z.array(z.string()).optional(),
  nip: z.string().optional(),
  nik: z
    .string()
    .min(16, { message: lang.text("nikValidation") })
    .optional(),
  noTlp: z.string().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.number().optional(),
  sekolahId: z.number().optional(),
  usernameInstagram: z.string().optional(),
  noWhatsApp: z.string().optional(),
});
