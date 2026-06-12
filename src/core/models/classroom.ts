import { BiodataSiswa } from "./biodata";
import { CourseDataModel } from "./course";

export interface ClassroomDataModel {
  id: number;
  namaKelas: string;
  level: string;
  kodeKelas: string;
  sekolahId: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string;
  MataPelajaran: CourseDataModel[];
  biodataSiswa: BiodataSiswa[];
  attendanceScheduleId?: number;
  attendanceSchedule?: {
    id: number;
    name: string;
    description: string;
  };
  Sekolah: {
    id: number;
    namaSekolah: string;
  };
}

export interface ClassroomCreationModel {
  namaKelas?: string;
  level?: string;
  sekolahId?: number;
}
