import { get } from "lodash";

export const APP_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME,
  appDesc: import.meta.env.VITE_APP_DESCRIPTION,
  baseName: import.meta.env.VITE_BASE_NAME,
  staticUrl: import.meta.env.VITE_STATIC_BASE_URL,
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME,
  themeKey: import.meta.env.VITE_THEME_KEY,
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseCDN: import.meta.env.VITE_CDN_BASE_URL,
};

export const QUERY_CONFIG = {
  persistorThrottleTime: 1000,
  persistorKey: "pkoZC7TvJYaKj4qfKnxX",
  retry: 0,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
};

export const SERVICE_ENDPOINTS = {
  cdn: {
    getFile: "/uploads/face-enrollment",
    uploadFile: "/api/upload-face",
    uploadIzin: "/api/upload-local",
  },
  attedance: {
    createAttedance: "/api/absen-masuk-manual",
  },
  excel: {
    importExcel: "/api/upload-excel",
  },
  auth: {
    login: "/login",
    logout: "/api/logout",
    signup: "/signup",
    forgetPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  biodata: {
    allAttedance: "/api/get-biodata-siswa-new",
    attedance: "/get-biodata-siswa-new",
    siswa: "/api/get-biodata-siswa",
    guru: "/api/get-all-guru",
  },
  ekstrakurikuler: {
    all: "/api/ekstrakurikuler",
    schedules: "/api/ekstrakurikuler/jadwal",
  },
  student: {
    list: "/api/user-siswa",
  },
  graduations: {
    all: "/api/get-kelulusan",
    create: "/api/create-kelulusan",
  },
  province: {
    provinces: "/get-province",
  },
  school: {
    createSchool: "/create-sekolah",
    schools: "/api/sekolah",
    schools2: "/api/sekolah",
    classrooms: "/api/kelas",
    courses: "/api/mata-pelajaran",
    mapelClassroom: "/api/mapel-kelas",
  },
  schedule: {
    create: "/api/jadwal-mata-pelajaran",
    update: "/api/jadwal-mata-pelajaran",
    schedules: "/api/jadwal-mata-pelajaran",
    delete: "/api/jadwal-mata-pelajaran",
  },
  users: {
    parents: "/api/all-orang-tua",
    teachers: "/api/get-all-guru",
    students: "/api/get-biodata-siswa",
    notifParents: "/api/user/notif-ortu/{user_id}",
  },
  user: {
    user: "/api/user",
    childParent: "/api/user/daftar-anak",
    update: "api/update-user",
    admin: "/api/all-admin",
    profile: "/api/profile",
    employees: "/ms-user/api/employees",
    photo: "/ms-user/api/profile/photo",
    changePassword: "/ms-user/api/account/changePassword",
    createTeacher: "/signup/guru",
    createParents: "/signup/orangtua",
    createSiswa: "/signup/siswa",
    absenQr: "/api/masuk-mata-pelajaran",
    generateQr: "/api/generate-dynamic-qr",
    generateQrRfid: "/api/generate-qr-rfid",
    registerFace: "/api/register-face",
    registerFaceTeacher: "/api/register-face-guru",
  },
  otp: {
    verify: "/verify-otp",
    resend: "/resend-otp",
  },
  dispensasi: {
    all: "/api/get-dispensasi",
    create: "/api/dispensasi",
    get: "/api/dispensasi",
    getPending: "/api/dispensasi/pending",
    getDispensiStudent: "/api/dispensasi/daftar-anak",
    approve: "/api/dispensasi/{dispensasi_id}/approve",
    reject: "/api/dispensasi/{dispensasi_id}/reject",
  },
  classroom: {
    classroom: "/api/kelas",
  },
  teacher: {
    detail: "/api/get-guru",
    waliKelas: "/api/wali-kelas",
    generateQrCode: "/api/qr-mapel/generate",
  },
  libraries: {
    all: "/api/get-history-perpus",
    createAbsenManual: "/api/absen-manual-perpus",
  },
  library: {
    vistor: "/index.php?p=api/visitor/today",
  },
  cards: {
    all: "/api/cards/unassigned",
    get: "/api/cards",
    create: "/api/cards",
    update: "/api/cards",
    delete: "/api/cards",
    assignCardToUser: "/api/cards/{card_id}/assign",
    unAsssignCardToUser: "/api/cards/{card_id}/unassign",
  },
  attendances: {
    list: "/api/riwayat-absensi",
    listMataPelajaran: "/api/riwayat-absensi-mapel",
    exportExcel: "/api/riwayat-absensi/export/excel",
    exportPdf: "/api/riwayat-absensi/export/pdf",
    exportMapelExcel: "/api/riwayat-absensi-mapel/export/excel",
    exportMapelPdf: "/api/riwayat-absensi-mapel/export/pdf",
    absentMapel: "/api/absen-mapel/harian",
    absentManual: "/api/absen-manual-mapel",
  },
  dashboard: {
    absensiList: "/api/dashboard/absensi-count",
    classChart: "/api/dashboard/class-chart",
    genderChart: "/api/dashboard/gender-chart",
    attendanceDetail: "/api/dashboard/attendance-detail",
    schoolDetail: "/api/dashboard/schools-detail",
    listCount: "/api/dashboard",
  },
  settings: {
    getSetting: "/api/app-setting",
    updateSetting: "/api/app-setting",
  },
  scheduler: {
    main: "/api/attendance/schedules",
    holiday: "/api/attendance/holidays",
  },
};
