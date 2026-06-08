import { lang } from "@/core/libs";

import { z } from "zod";

export const settingsSchema = z.object({
    studentAttendanceNotification: z.boolean(),
    teacherAttendanceNotification: z.boolean(),
    parentAttendanceNotification: z.boolean(),
    courseAttendanceNotification: z.boolean(),
    extracurricularAttendanceNotification: z.boolean(),
});

export const settingsSchemaNew = z.object({
    
})