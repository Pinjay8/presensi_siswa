import { z } from "zod";

export const updateProfileSchema = z.object({
    nama: z
        .string()
        .min(1, { message: "Nama harus minimal 1 karakter" })
        .optional(),
    jk: z
        .enum(["Pria", "Wanita"], {
            message: "Jenis kelamin harus Pria atau Wanita",
        })
        .optional(),
    agama: z.string().optional(),
    tempat_lahir: z.string().optional(),
    tgl_lahir: z.string().optional(),
    alamat_dom: z.string().optional(),
    jml_anak: z.number().nullable().optional(),
    no_hp: z.string().optional(),
    email: z
        .string()
        .email({ message: "Format email tidak valid, silahkan cek kembali!" })
        .optional(),
    kontak_darurat: z.string().optional(),
    alamat_ktp: z.string().optional(),
    status: z
        .enum(["Menikah", "Lajang"], {
            message: "Status harus Menikah atau Lajang",
        })
        .optional(),
});