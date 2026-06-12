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
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
  nis: z.string().min(1, "NIS wajib diisi"),
  nisn: z.string().min(1, "NISN wajib diisi"),
  noTlp: z.string().min(1, "No Telepon wajib diisi"),
  noTlpOrtu: z.string().optional(),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  password: z.string().optional(),
  // sekolahId: z.number(),
  jenisKelamin: z.enum(["Male", "Female"]),
  tanggalLahir: z.string(),
  rfid: z.string().optional(),
});

export type CreateSiswaFormValues = z.infer<typeof createSiswaSchema>;
