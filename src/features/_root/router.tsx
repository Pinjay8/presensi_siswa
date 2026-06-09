import { APP_CONFIG } from "@/core/configs/app";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, RootPage } from "../dashboard";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
      // errorElement: <Default404 />,
      children: [
        {
          path: "qr-scan",
          lazy: () =>
            import("../ScanAttendance/pages/scan-attendance-view").then(
              (m) => ({
                Component: m.ScanAttendanceView,
              }),
            ),
        },
        {
          path: "format",
          lazy: () =>
            import("../letter/containers/letter-preview").then((m) => ({
              Component: m.LetterPreview,
            })),
        },
        {
          path: "format/pdf",
          lazy: () =>
            import("../letter/pages").then((m) => ({
              Component: m.LetterPage,
            })),
        },
        {
          path: "library",
          lazy: () =>
            import("../library/pages/home").then((m) => ({
              Component: m.LibraryHomePage,
            })),
        },
        {
          path: "library/visit",
          lazy: () =>
            import("../library/pages/library-attedances").then((m) => ({
              Component: m.LibraryLanding,
            })),
        },
        {
          path: "/card/generate",
          lazy: () =>
            import("@/features/kartuSiswa").then((m) => ({
              Component: m.StudentCardPage,
            })),
        },
        {
          path: "/events",
          lazy: () =>
            import("@/features/events").then((m) => ({
              Component: m.CalendarEvent,
            })),
        },
        {
          index: true,
          lazy: () =>
            import("../dashboard").then((m) => ({
              Component: m.HomePage,
            })),
        },
        {
          path: "/location/students",
          lazy: () =>
            import("../locations/pages/location-landing").then((m) => ({
              Component: m.LocationLanding,
            })),
        },
        {
          path: "schedules",
          lazy: () =>
            import("../schedules/pages/schedules-landing").then((m) => ({
              Component: m.ScheduleLanding,
            })),
        },
        {
          path: "licensing",
          lazy: () =>
            import("../licensing/pages/licensing").then((m) => ({
              Component: m.LicensingPage,
            })),
        },

        {
          path: "profile/edit",
          lazy: () =>
            import("@/features/profile").then((m) => ({
              Component: m.EditProfileForm,
            })),
        },
        {
          path: "profile/change-password",
          lazy: () =>
            import("../changePassword/pages/form").then((m) => ({
              Component: m.ChangePasswordFormPage,
            })),
        },

        {
          path: "schools",
          lazy: () =>
            import("@/features/schools").then((m) => ({
              Component: m.SchoolLanding,
            })),
        },
        {
          path: "schools/distribution",
          lazy: () =>
            import("../schools/pages/school-distribution").then((m) => ({
              Component: m.SchoolDistribution,
            })),
        },
        {
          path: "schools/:id",
          lazy: () =>
            import("@/features/schools").then((m) => ({
              Component: m.SchoolDetail,
            })),
          children: [
            {
              index: true,
              lazy: () =>
                import("@/features/schools").then((m) => ({
                  Component: m.SchoolStudent,
                })),
            },
            {
              path: "teachers",
              lazy: () =>
                import("@/features/schools").then((m) => ({
                  Component: m.SchoolTeacher,
                })),
            },
            {
              path: "classrooms",
              lazy: () =>
                import("@/features/schools").then((m) => ({
                  Component: m.SchoolClassroom,
                })),
            },
            {
              path: "courses",
              lazy: () =>
                import("@/features/schools").then((m) => ({
                  Component: m.SchoolCourse,
                })),
            },
          ],
        },

        {
          path: "schools/edit/:id",
          lazy: () =>
            import("@/features/schools").then((m) => ({
              Component: m.SchoolCreation,
            })),
        },

        {
          path: "classrooms",
          lazy: () =>
            import("@/features/classroom").then((m) => ({
              Component: m.ClassroomLanding,
            })),
        },
        {
          path: "classrooms/:id",
          lazy: () =>
            import("@/features/classroom").then((m) => ({
              Component: m.ClassroomDetail,
            })),
        },
        {
          path: "classrooms/create",
          lazy: () =>
            import("@/features/classroom").then((m) => ({
              Component: m.ClassroomCreate,
            })),
        },
        {
          path: "classrooms/edit/:id",
          lazy: () =>
            import("@/features/classroom").then((m) => ({
              Component: m.ClassroomEdit,
            })),
        },
        {
          path: "classrooms/delete/:id",
          lazy: () =>
            import("@/features/classroom").then((m) => ({
              Component: m.ClassroomDelete,
            })),
        },

        {
          path: "courses",
          lazy: () =>
            import("@/features/course").then((m) => ({
              Component: m.CourseLanding,
            })),
        },
        {
          path: "courses/delete/:id",
          lazy: () =>
            import("@/features/course").then((m) => ({
              Component: m.CourseDelete,
            })),
        },
        {
          path: "courses/create",
          lazy: () =>
            import("@/features/course").then((m) => ({
              Component: m.CourseCreate,
            })),
        },
        {
          path: "courses/edit/:id",
          lazy: () =>
            import("@/features/course").then((m) => ({
              Component: m.CourseEdit,
            })),
        },

        {
          path: "students",
          lazy: () =>
            import("@/features/student").then((m) => ({
              Component: m.StudentLanding,
            })),
        },
        {
          path: "students/edit/:id",
          lazy: () =>
            import("@/features/student").then((m) => ({
              Component: m.StudentEdit,
            })),
        },

        {
          path: "students/:id",
          lazy: () =>
            import("@/features/student").then((m) => ({
              Component: m.StudentDetail,
            })),
          children: [
            {
              index: true,
              lazy: () =>
                import("@/features/student").then((m) => ({
                  Component: m.StudentDailyPresence,
                })),
            },
            {
              path: "course-presences",
              lazy: () =>
                import("@/features/student").then((m) => ({
                  Component: m.StudentCoursePresence,
                })),
            },
            {
              path: "parents",
              lazy: () =>
                import("@/features/student").then((m) => ({
                  Component: m.StudentParent,
                })),
            },
            {
              path: "library-visit",
              lazy: () =>
                import("@/features/student").then((m) => ({
                  Component: m.StudentLibrary,
                })),
            },
            {
              path: "moodle",
              lazy: () =>
                import("@/features/student").then((m) => ({
                  Component: m.StudentMoodles,
                })),
            },
          ],
        },
        {
          path: "students/create",
          lazy: () =>
            import("@/features/_global").then((m) => ({
              Component: m.CommingSoonPage,
            })),
        },
        {
          path: "students/edit/:id",
          lazy: () =>
            import("@/features/_global").then((m) => ({
              Component: m.CommingSoonPage,
            })),
        },
        {
          path: "teachers",
          lazy: () =>
            import("@/features/teacher").then((m) => ({
              Component: m.TeacherLanding,
            })),
        },
        {
          path: "teachers/create",
          lazy: () =>
            import("../teacher/pages/teacher-create").then((m) => ({
              Component: m.TeacherCreate,
            })),
        },
        {
          path: "teachers/edit/:id",
          lazy: () =>
            import("@/features/teacher").then((m) => ({
              Component: m.TeacherEdit,
            })),
        },
        {
          path: "teachers/:id",
          lazy: () =>
            import("@/features/teacher").then((m) => ({
              Component: m.TeacherDetail,
            })),
          children: [
            {
              index: true,
              lazy: () =>
                import("@/features/teacher").then((m) => ({
                  Component: m.TeacherDailyPresence,
                })),
            },
          ],
        },
        {
          path: "parents",
          lazy: () =>
            import("@/features/parents").then((m) => ({
              Component: m.ParentLanding,
            })),
        },
        {
          path: "parents/:id",
          lazy: () =>
            import("@/features/parents").then((m) => ({
              Component: m.ParentDetail,
            })),
        },
        {
          path: "parents/create",
          lazy: () =>
            import("../parents/pages/parent-create").then((m) => ({
              Component: m.ParentCreate,
            })),
        },
        {
          path: "parents/edit/:id",
          lazy: () =>
            import("@/features/parents").then((m) => ({
              Component: m.ParentEdit,
            })),
        },
        {
          path: "/graduation",
          lazy: () =>
            import("../graduation/pages").then((m) => ({
              Component: m.GraduationLanding,
            })),
        },
        {
          path: "admin/users",
          lazy: () =>
            import("@/features/user").then((m) => ({
              Component: m.AdminLanding,
            })),
        },
        {
          path: "admin/users/edit/:id",
          lazy: () =>
            import("@/features/user").then((m) => ({
              Component: m.AdminEdit,
            })),
        },
        {
          path: "attendance/students",
          lazy: () =>
            import("@/features/attendance").then((m) => ({
              Component: m.StudentAttendance,
            })),
        },
        {
          path: "attendance/create",
          lazy: () =>
            import("@/features/attendance").then((m) => ({
              Component: m.AttendanceCreate,
            })),
        },
        {
          path: "attendance/history",
          lazy: () =>
            import("@/features/attendance").then((m) => ({
              Component: m.HistoryAttendance,
            })),
        },
        {
          path: "attendance/courses",
          lazy: () =>
            import("@/features/attendance").then((m) => ({
              Component: m.MatkulAttendance,
            })),
        },
        {
          path: "attendance/teachers",
          lazy: () =>
            import("@/features/attendance").then((m) => ({
              Component: m.TeacherAttendance,
            })),
        },
        {
          path: "cards",
          lazy: () =>
            import("../cards").then((m) => ({
              Component: m.CardView,
            })),
        },
        {
          path: "cards/create",
          lazy: () =>
            import("../cards/pages/CardCreate").then((m) => ({
              Component: m.CardCreate,
            })),
        },
        {
          path: "cards/edit/:id",
          lazy: () =>
            import("../cards/pages/CardEdit").then((m) => ({
              Component: m.CardEdit,
            })),
        },
        {
          path: "cards/delete/:id",
          lazy: () =>
            import("../cards/pages/CardsDelete").then((m) => ({
              Component: m.CardsDelete,
            })),
        },
        {
          path: "logout",
          lazy: () =>
            import("@/features/auth").then((m) => ({
              Component: m.Logout,
            })),
        },
      ],
    },
    {
      path: "/auth",
      lazy: () =>
        import("@/features/auth").then((m) => ({
          Component: m.AuthPage,
        })),
      children: [
        {
          path: "login",
          lazy: () =>
            import("@/features/auth").then((m) => ({
              Component: m.LoginPage,
            })),
        },
        {
          path: "forget-password",
          lazy: () =>
            import("@/features/auth").then((m) => ({
              Component: m.ForgetPassword,
            })),
        },
        {
          path: "reset-password/:token",
          lazy: () =>
            import("@/features/auth").then((m) => ({
              Component: m.ResetPassword,
            })),
        },
      ],
    },
    // {
    //   path: "/attendance",
    //   element: <HistoryAttendance />,
    // },
    {
      path: "/schools/register",
      lazy: () =>
        import("@/features/schools").then((m) => ({
          Component: m.SchoolRegister,
        })),
    },
    {
      path: "/otp",
      lazy: () =>
        import("@/features/otp").then((m) => ({
          Component: m.Otp,
        })),
    },
  ],
  {
    basename: APP_CONFIG.baseName,
  },
);
