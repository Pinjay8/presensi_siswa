// import { createBrowserRouter } from "react-router-dom";

// import { APP_CONFIG } from "@/core/configs/app";

// // Layout
// import { RootPage, HomePage } from "@/pages/dashboard";

// // Global
// import { CommingSoonPage } from "@/features/_global";

// // Auth
// import {
//   AuthPage,
//   ForgetPassword,
//   LoginPage,
//   Logout,
//   ResetPassword,
// } from "@/features/auth";

// // Attendance
// import {
//   AttendanceCreate,
//   HistoryAttendance,
//   MatkulAttendance,
//   StudentAttendance,
//   TeacherAttendance,
// } from "@/features/attendance";

// // Classroom
// import {
//   ClassroomCreate,
//   ClassroomDelete,
//   ClassroomDetail,
//   ClassroomEdit,
//   ClassroomLanding,
// } from "@/features/classroom";

// // Course
// import {
//   CourseCreate,
//   CourseDelete,
//   CourseEdit,
//   CourseLanding,
// } from "@/features/course";

// // Events
// import { CalendarEvent } from "@/features/events";

// // Card
// import { StudentCardPage } from "@/features/kartuSiswa";

// // OTP
// import { Otp } from "@/features/otp";

// // Parents
// import { ParentDetail, ParentEdit, ParentLanding } from "@/features/parents";

// // Profile
// import { EditProfileForm } from "@/features/profile";

// // Schools
// import {
//   SchoolClassroom,
//   SchoolCourse,
//   SchoolCreation,
//   SchoolDetail,
//   SchoolLanding,
//   SchoolRegister,
//   SchoolStudent,
//   SchoolTeacher,
// } from "@/features/schools";

// // Students
// import {
//   StudentCoursePresence,
//   StudentDailyPresence,
//   StudentDetail,
//   StudentEdit,
//   StudentLanding,
//   StudentLibrary,
//   StudentMoodles,
//   StudentParent,
// } from "@/features/student";

// // Teachers
// import {
//   TeacherDailyPresence,
//   TeacherDetail,
//   TeacherEdit,
//   TeacherLanding,
// } from "@/features/teacher";

// // Users
// import { AdminEdit, AdminLanding } from "@/features/user";

// // Other Pages
// import { ChangePasswordFormPage } from "@/pages/change-password/pages";
// import { GraduationLanding } from "@/pages/graduation/pages";
// import { LetterPreview } from "@/pages/letter/containers/letter-preview";
// import { LetterPage } from "@/pages/letter/pages";
// import { LibraryHomePage } from "@/pages/library/pages/home";
// import { LibraryLanding } from "@/pages/library/pages/library-attedances";
// import { LicensingPage } from "@/pages/licensing/pages/licensing";
// import { LocationLanding } from "@/pages/locations/pages/location-landing";
// import { ScheduleLanding } from "@/pages/schedules/pages/schedules-landing";
// import { SchoolDistribution } from "@/pages/schools/pages/school-distribution";

// export const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <RootPage />,
//       children: [
//         // Home
//         {
//           index: true,
//           element: <HomePage />,
//         },

//         // Letter
//         {
//           path: "format",
//           element: <LetterPreview />,
//         },
//         {
//           path: "format/pdf",
//           element: <LetterPage />,
//         },

//         // Library
//         {
//           path: "library",
//           element: <LibraryHomePage />,
//         },
//         {
//           path: "library/visit",
//           element: <LibraryLanding />,
//         },

//         // Card
//         {
//           path: "card/generate",
//           element: <StudentCardPage />,
//         },

//         // Events
//         {
//           path: "events",
//           element: <CalendarEvent />,
//         },

//         // Location
//         {
//           path: "location/students",
//           element: <LocationLanding />,
//         },

//         // Schedule
//         {
//           path: "schedules",
//           element: <ScheduleLanding />,
//         },

//         // Licensing
//         {
//           path: "licensing",
//           element: <LicensingPage />,
//         },

//         // Profile
//         {
//           path: "profile/edit",
//           element: <EditProfileForm />,
//         },
//         {
//           path: "profile/change-password",
//           element: <ChangePasswordFormPage />,
//         },

//         // Schools
//         {
//           path: "schools",
//           element: <SchoolLanding />,
//         },
//         {
//           path: "schools/distribution",
//           element: <SchoolDistribution />,
//         },
//         {
//           path: "schools/edit/:id",
//           element: <SchoolCreation />,
//         },
//         {
//           path: "schools/:id",
//           element: <SchoolDetail />,
//           children: [
//             {
//               index: true,
//               element: <SchoolStudent />,
//             },
//             {
//               path: "teachers",
//               element: <SchoolTeacher />,
//             },
//             {
//               path: "classrooms",
//               element: <SchoolClassroom />,
//             },
//             {
//               path: "courses",
//               element: <SchoolCourse />,
//             },
//           ],
//         },

//         // Classrooms
//         {
//           path: "classrooms",
//           element: <ClassroomLanding />,
//         },
//         {
//           path: "classrooms/create",
//           element: <ClassroomCreate />,
//         },
//         {
//           path: "classrooms/:id",
//           element: <ClassroomDetail />,
//         },
//         {
//           path: "classrooms/edit/:id",
//           element: <ClassroomEdit />,
//         },
//         {
//           path: "classrooms/delete/:id",
//           element: <ClassroomDelete />,
//         },

//         // Courses
//         {
//           path: "courses",
//           element: <CourseLanding />,
//         },
//         {
//           path: "courses/create",
//           element: <CourseCreate />,
//         },
//         {
//           path: "courses/edit/:id",
//           element: <CourseEdit />,
//         },
//         {
//           path: "courses/delete/:id",
//           element: <CourseDelete />,
//         },

//         // Students
//         {
//           path: "students",
//           element: <StudentLanding />,
//         },
//         {
//           path: "students/create",
//           element: <CommingSoonPage />,
//         },
//         {
//           path: "students/edit/:id",
//           element: <StudentEdit />,
//         },
//         {
//           path: "students/:id",
//           element: <StudentDetail />,
//           children: [
//             {
//               index: true,
//               element: <StudentDailyPresence />,
//             },
//             {
//               path: "course-presences",
//               element: <StudentCoursePresence />,
//             },
//             {
//               path: "parents",
//               element: <StudentParent />,
//             },
//             {
//               path: "library-visit",
//               element: <StudentLibrary />,
//             },
//             {
//               path: "moodle",
//               element: <StudentMoodles />,
//             },
//           ],
//         },

//         // Teachers
//         {
//           path: "teachers",
//           element: <TeacherLanding />,
//         },
//         {
//           path: "teachers/create",
//           element: <TeacherEdit />,
//         },
//         {
//           path: "teachers/edit/:id",
//           element: <TeacherEdit />,
//         },
//         {
//           path: "teachers/:id",
//           element: <TeacherDetail />,
//           children: [
//             {
//               index: true,
//               element: <TeacherDailyPresence />,
//             },
//           ],
//         },

//         // Parents
//         {
//           path: "parents",
//           element: <ParentLanding />,
//         },
//         {
//           path: "parents/:id",
//           element: <ParentDetail />,
//         },
//         {
//           path: "parents/edit/:id",
//           element: <ParentEdit />,
//         },

//         // Graduation
//         {
//           path: "graduation",
//           element: <GraduationLanding />,
//         },

//         // Admin
//         {
//           path: "admin/users",
//           element: <AdminLanding />,
//         },
//         {
//           path: "admin/users/edit/:id",
//           element: <AdminEdit />,
//         },

//         // Attendance
//         {
//           path: "attendance/students",
//           element: <StudentAttendance />,
//         },
//         {
//           path: "attendance/create",
//           element: <AttendanceCreate />,
//         },
//         {
//           path: "attendance/history",
//           element: <HistoryAttendance />,
//         },
//         {
//           path: "attendance/courses",
//           element: <MatkulAttendance />,
//         },
//         {
//           path: "attendance/teachers",
//           element: <TeacherAttendance />,
//         },

//         // Logout
//         {
//           path: "logout",
//           element: <Logout />,
//         },
//       ],
//     },

//     // Auth
//     {
//       path: "/auth",
//       element: <AuthPage />,
//       children: [
//         {
//           path: "login",
//           element: <LoginPage />,
//         },
//         {
//           path: "forget-password",
//           element: <ForgetPassword />,
//         },
//         {
//           path: "reset-password/:token",
//           element: <ResetPassword />,
//         },
//       ],
//     },

//     // Public
//     {
//       path: "/schools/register",
//       element: <SchoolRegister />,
//     },
//     {
//       path: "/otp",
//       element: <Otp />,
//     },
//   ],
//   {
//     basename: APP_CONFIG.baseName,
//   },
// );
