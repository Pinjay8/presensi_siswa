import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import {
  AuthPage,
  ForgetPassword,
  LoginPage,
  Logout,
  ResetPassword,
} from "@/features/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, RootPage } from "../dashboard";

// Load Component for Pages
import { CommingSoonPage, Default404, Vokadash } from "@/features/_global";
import {
  AttendanceCreate,
  HistoryAttendance,
  MatkulAttendance,
  StudentAttendance,
  TeacherAttendance,
} from "@/features/attendance";
import {
  ClassroomCreate,
  ClassroomDelete,
  ClassroomDetail,
  ClassroomEdit,
  ClassroomLanding,
} from "@/features/classroom";
import {
  CourseCreate,
  CourseDelete,
  CourseEdit,
  CourseLanding,
} from "@/features/course";
import { CalendarEvent } from "@/features/events";
import { StudentCardPage } from "@/features/kartuSiswa";
import { Otp } from "@/features/otp";
import { ParentDetail, ParentEdit, ParentLanding } from "@/features/parents";
import { EditProfileForm } from "@/features/profile";
import {
  SchoolClassroom,
  SchoolCourse,
  SchoolCreation,
  SchoolDetail,
  SchoolLanding,
  SchoolRegister,
  SchoolStudent,
  SchoolTeacher,
} from "@/features/schools";
import {
  StudentCoursePresence,
  StudentDailyPresence,
  StudentDetail,
  StudentEdit,
  StudentLanding,
  StudentLibrary,
  StudentMoodles,
  StudentParent,
} from "@/features/student";
import {
  TeacherDailyPresence,
  TeacherDetail,
  TeacherEdit,
  TeacherLanding,
} from "@/features/teacher";
import { AdminEdit, AdminLanding } from "@/features/user";
import { ChangePasswordFormPage } from "../changePassword/pages/form";
import { GraduationLanding } from "../graduation/pages";
import { LetterPreview } from "../letter/containers/letter-preview";
import { LetterPage } from "../letter/pages";
import { LibraryHomePage } from "../library/pages/home";
import { LibraryLanding } from "../library/pages/library-attedances";
import { LicensingPage } from "../licensing/pages/licensing";
import { ScheduleLanding } from "../schedules/pages/schedules-landing";
import { SchoolDistribution } from "../schools/pages/school-distribution";
import { LocationLanding } from "../locations/pages/location-landing";
import { TeacherCreate } from "../teacher/pages/teacher-create";
import { ParentCreate } from "../parents/pages/parent-create";
import { ScanAttendanceTable } from "../ScanAttendance/containers/scan-attendance-table";
import { ScanAttendanceView } from "../ScanAttendance/pages/scan-attendance-view";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
      // errorElement: <Default404 />,
      children: [
        {
          path: "qr-scan",
          element: <ScanAttendanceView />,
        },
        {
          path: "format",
          element: <LetterPreview />,
        },
        {
          path: "format/pdf",
          element: <LetterPage />,
        },
        {
          path: "library",
          element: <LibraryHomePage />,
        },
        {
          path: "library/visit",
          element: <LibraryLanding />,
        },
        {
          path: "/card/generate",
          element: <StudentCardPage />,
        },
        {
          path: "/events",
          element: <CalendarEvent />,
        },
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/location/students",
          element: <LocationLanding />,
        },
        {
          path: "schedules",
          element: <ScheduleLanding />,
        },
        {
          path: "licensing",
          element: <LicensingPage />,
        },

        {
          path: "profile/edit",
          element: <EditProfileForm />,
        },
        {
          path: "profile/change-password",
          element: <ChangePasswordFormPage />,
        },
        {
          path: "schools",
          element: <SchoolLanding />,
        },
        {
          path: "schools/distribution",
          element: <SchoolDistribution />,
        },
        {
          path: "schools/:id",
          element: <SchoolDetail />,
          children: [
            {
              index: true,
              element: <SchoolStudent />,
            },
            {
              path: "teachers",
              element: <SchoolTeacher />,
            },
            {
              path: "classrooms",
              element: <SchoolClassroom />,
            },
            {
              path: "courses",
              element: <SchoolCourse />,
            },
          ],
        },

        {
          path: "schools/edit/:id",
          element: <SchoolCreation />,
        },
        {
          path: "classrooms",
          element: <ClassroomLanding />,
        },
        {
          path: "classrooms/:id",
          element: <ClassroomDetail />,
        },
        {
          path: "classrooms/create",
          element: <ClassroomCreate />,
        },
        {
          path: "classrooms/edit/:id",
          element: <ClassroomEdit />,
        },
        {
          path: "classrooms/delete/:id",
          element: <ClassroomDelete />,
        },
        {
          path: "courses",
          element: <CourseLanding />,
        },

        {
          path: "courses/delete/:id",
          element: <CourseDelete />,
        },
        {
          path: "courses/create",
          element: <CourseCreate />,
        },
        {
          path: "courses/edit/:id",
          element: <CourseEdit />,
        },
        {
          path: "students",
          element: <StudentLanding />,
        },
        {
          path: "students/edit/:id",
          element: <StudentEdit />,
        },
        {
          path: "students/:id",
          element: <StudentDetail />,
          children: [
            {
              index: true,
              element: <StudentDailyPresence />,
            },
            {
              path: "course-presences",
              element: <StudentCoursePresence />,
            },
            {
              path: "parents",
              element: <StudentParent />,
            },

            {
              path: "library-visit",
              element: <StudentLibrary />,
            },
            {
              path: "moodle",
              element: <StudentMoodles />,
            },
          ],
        },
        {
          path: "students/create",
          element: <CommingSoonPage />,
        },
        {
          path: "students/edit/:id",
          element: <CommingSoonPage />,
        },
        {
          path: "teachers",
          element: <TeacherLanding />,
        },
        {
          path: "teachers/create",
          element: <TeacherCreate />,
        },
        {
          path: "teachers/edit/:id",
          element: <TeacherEdit />,
        },
        {
          path: "teachers/:id",
          element: <TeacherDetail />,
          children: [
            {
              index: true,
              element: <TeacherDailyPresence />,
            },
          ],
        },
        {
          path: "parents",
          element: <ParentLanding />,
        },
        {
          path: "parents/:id",
          element: <ParentDetail />,
        },
        // create
        {
          path: "parents/create",
          element: <ParentCreate />,
        },
        {
          path: "parents/edit/:id",
          element: <ParentEdit />,
        },
        {
          path: "/graduation",
          element: <GraduationLanding />,
        },
        {
          path: "admin/users",
          element: <AdminLanding />,
        },
        {
          path: "admin/users/edit/:id",
          element: <AdminEdit />,
        },
        {
          path: "attendance/students",
          element: <StudentAttendance />,
        },
        {
          path: "attendance/create",
          element: <AttendanceCreate />,
        },
        {
          path: "attendance/history",
          element: <HistoryAttendance />,
        },
        {
          path: "attendance/courses",
          element: <MatkulAttendance />,
        },
        {
          path: "attendance/teachers",
          element: <TeacherAttendance />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
    // {
    //   path: "/attendance",
    //   element: <HistoryAttendance />,
    // },
    {
      path: "/schools/register",
      element: <SchoolRegister />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
  ],
  {
    basename: APP_CONFIG.baseName,
  },
);

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash
      appName={APP_CONFIG.appName}
      menus={sidebarMenus}
      usermenus={usermenus}
    >
      <RouterProvider router={router} />
    </Vokadash>
  );
};

export const App = () => {
  return <RootApp />;
};
