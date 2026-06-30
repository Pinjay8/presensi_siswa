export interface SettingsDataModel {
  id: number;
  sekolahId: number;
  attendanceSiswa: boolean;
  attendanceOrangTua: boolean;
  attendanceMapelSiswa: boolean;
  attendanceMapelOrangTua: boolean;
  ekskulOrangTua: boolean;
  ekskulSiswa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsUpdateModel {
  attendanceSiswa: boolean;
  attendanceOrangTua: boolean;
  attendanceMapelSiswa: boolean;
  attendanceMapelOrangTua: boolean;
}
