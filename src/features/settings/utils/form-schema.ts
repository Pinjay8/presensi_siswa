import { lang } from "@/core/libs";

import { z } from "zod";

// export type attendanceNotificationType = {
//     siswa: boolean;
//     orangTua: boolean;
// }

export const settingsSchema = z.object({
    studentAttendanceNotification: z.boolean(),
    teacherAttendanceNotification: z.boolean(),
    parentAttendanceNotification: z.boolean(),
    courseAttendanceNotification: z.boolean(),
    extracurricularAttendanceNotification: z.boolean(),
});

export const settingsSchemaNew = z.object({
  attendanceSiswa: z.coerce.boolean(),
  attendanceOrangTua: z.coerce.boolean(),
  attendanceMapelSiswa: z.coerce.boolean(),
  attendanceMapelOrangTua: z.coerce.boolean(),
  ekskulOrangTua: z.coerce.boolean(),
  ekskulSiswa: z.coerce.boolean(),
});