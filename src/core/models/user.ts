import { lang } from "../libs";
import { BiodataSiswa, Kelas } from "./biodata";
import { SchoolDataModel } from "./schools";

export type TimestampType = string | null;

export interface UserDataModel {
  id: number;
  idKelas?: number;
  kelasId?: number;
  namaKelas?: string;
  email: string;
  password: string;
  alamat: string;
  hobi: string;
  name: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kotaId: number;
  provinceId: number;
  role: string;
  rfid: string;
  nisn: string;
  nrk: string;
  noTelegram: string;
  noTlpOrtu: string;
  nikki: string;
  image: string;
  nis: string;
  nip: string;
  usernameInstagram: string;
  noWhatsApp: string;
  nik: string;
  kelas?: Kelas;
  noTlp: string;
  lastLogin: string;
  isVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: string;
  verificationToken: string;
  verificationTokenExpires: string;
  devicesId: string;
  createdAt: string;
  updatedAt: string;
  isActive: number;
  sekolahId: number;
  sekolah?: {
    id: number;
    namaSekolah: number;
  };
  school?: SchoolDataModel;
  student?: BiodataSiswa;
}

export interface UserCreationModel {
  email?: string;
  password?: string;
  alamat?: string;
  hobi?: string;
  name?: string;
  jenisKelamin?: string;
  tanggalLahir?: string;
  role?: string;
  rfid?: string;
  nisn?: string;
  namaKelas?: string;
  idKelas?: number;
  kelasId?: number;
  nrk?: string;
  nikki?: string;
  image?: string;
  nis?: string;
  nip?: string;
  nik?: string;
  noTlp?: string;
  lastLogin?: string;
  isVerified?: number;
  isActive?: number;
  sekolahId?: number;
}

import { z } from "zod";

export const createSiswaSchema = z.object({
  name: z.string().min(1, lang.text("nameValidation")),
  email: z.string().min(1, lang.text("emailValidation")).email(lang.text("emailValidation2")),
  nis: z.string().min(1, lang.text("nisValidation")),
  nisn: z
    .string()
    .min(1, lang.text("nisnValidation2"))
    .length(10, lang.text("nisnValidation")),
  noTlp: z.string().min(1, lang.text("numberPhoneValidation")),
  noTlpOrtu: z.string().min(1, lang.text("numberPhoneOrtuValidation")),
  alamat: z.string().min(1, lang.text("addressValidation")),
  password: z.string().min(1, lang.text("passwordValidation")),
  // sekolahId: z.number(),
  jenisKelamin: z.enum(["Male", "Female"]),
  tanggalLahir: z.string(),
  rfid: z.string().optional(),
});

export type CreateSiswaFormValues = z.infer<typeof createSiswaSchema>;
