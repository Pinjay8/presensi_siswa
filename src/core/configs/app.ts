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
};

export const QUERY_CONFIG = {
  persistorThrottleTime: 1000,
  persistorKey: "pkoZC7TvJYaKj4qfKnxX",
  retry: 0,
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
};

export const SERVICE_ENDPOINTS = {
  attedance: {
    createAttedance: "/api/absen-masuk-manual",
  },
  auth: {
    login: "/login",
    logout: "/logout",
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
  },
  user: {
    user: "/api/user",
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
    registerFace: "/api/register-face",
  },
  otp: {
    verify: "/verify-otp",
    resend: "/resend-otp",
  },
  classroom: {
    classroom: "/api/kelas",
  },
  teacher: {
    detail: "/api/get-guru",
    waliKelas: "/api/wali-kelas",
    generateQrCode: "/api/generate-qrcode-mapel",
  },
  libraries: {
    all: "/api/get-history-perpus",
    createAbsenManual: "/api/absen-manual-perpus",
  },
  library: {
    vistor: "/index.php?p=api/visitor/today",
  },
};
