import { lang } from "@/core/libs";

import { z } from "zod";

export const teacherEditSchema = z.object({
  email: z
    .string()
    .min(1, { message: lang.text("emailVerif") })
    .email({ message: lang.text("schoolCreationValidation6") }),
  password: z.string().min(6, { message: lang.text("minimumPassword") }),
  alamat: z.string().optional(),
  hobi: z.string().optional(),
  name: z.string().min(1, { message: lang.text("nameGuruValidation") }),
  jenisKelamin: z.string().optional(),
  tanggalLahir: z.string().optional(),
  role: z.string().optional(),
  rfid: z.string().optional(),
  noTelegram: z.string().optional(),
  nisn: z.string().optional(),
  noWhatsApp: z.string().optional(),
  usernameInstagram: z.string().optional(),
  kelasId: z.number().optional(),
  kelas: z.string().optional(),
  nrk: z
    .string()
    .refine((value) => value.length === 6, {
      message: lang.text("nrkValidation"),
    })
    .optional(),
  nikki: z
    .string()
    .refine((value) => value.length === 6, {
      message: lang.text("nikidValidation"),
    })
    .optional(),
  image: z.string().optional(),
  nis: z.string().optional(),
  nip: z
    .string()
    .min(18, { message: lang.text("nipValidation") })
    .max(18, { message: lang.text("nipValidation") })
    .optional(),
  nik: z.string().optional(),
  noTlp: z.string().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.number().optional(),
  // sekolahId: z.number().optional(),
});
