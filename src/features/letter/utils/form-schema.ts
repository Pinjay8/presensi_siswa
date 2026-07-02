import { lang } from "@/core/libs";
import z from "zod";

// export const letterUpdateFormSchema = z.object({
//     kopSurat: z.any().optional(), // File atau string (URL/Base64)
//     ttdKepalaSekolah: z.any().optional(), // File atau string (URL/Base64)
//     namaKepalaSekolah: z.string().min(1, { message: lang.text("principalNameRequired") }),
//     judulSurat: z.string().min(1, { message: lang.text("letterNameRequired") }),
// });


export const letterUpdateFormSchema = z.object({
  kopSurat: z.any().nullable(),
  ttdKepalaSekolah: z.any().nullable(),
  namaKepalaSekolah: z.string().min(1, "Nama kepala sekolah wajib diisi"),
  judulSurat: z.string().min(1, "Judul surat wajib diisi"),
  nomorSurat: z.string().optional(), // Make nomorSurat optional
  pembukaan: z.string().min(1, "Pembukaan wajib diisi"),
  pernyataanLulus: z.string().min(1, "Pernyataan lulus wajib diisi"),
  penutupan: z.string().min(1, "Penutupan wajib diisi"),
});