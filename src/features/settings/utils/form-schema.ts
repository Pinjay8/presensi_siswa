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
    attendance: z.object({
        siswa: z.coerce.boolean(),
        orangTua: z.coerce.boolean(),
    }),
    attendanceMapel: z.object({
        siswa: z.coerce.boolean(),
        orangTua: z.coerce.boolean(),
    })
});