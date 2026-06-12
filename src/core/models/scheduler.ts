export interface SchedulerDay {
    dayOfWeek: number;
    jamMasuk: string | null;
    jamPulang: string | null;
}

export interface SchedulerDataModel {
    id: number;
    sekolahId: number;
    name: string;
    description: string | null;
    type: "SISWA" | "GURU";
    isDefault: boolean;
    days: SchedulerDay[];
}

export interface SchedulerCreationModel {
    name: string;
    description: string | null;
    type: "SISWA" | "GURU";
    isDefault: boolean;
    days: SchedulerDay[];
}
