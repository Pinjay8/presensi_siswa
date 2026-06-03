import { VokadashProps } from "@/features/_global";
import { lang } from "../libs";

export const MENU_STAFF: VokadashProps["menus"] = [
  {
    title: lang.text("dashboard"),
    url: "/",
    icon: "LayoutDashboard",
  },
  // {
  //   title: lang.text("schoolDistribution"),
  //   url: "/schools/distribution",
  //   icon: "LayoutDashboard",
  // },
  {
    title: lang.text("attendanceManagement"),
    url: "/attendance-management",
    icon: "LogInIcon",
    items: [
      {
        title: lang.text("studentAttendance"),
        url: "/attendance/students",
        icon: "Users",
      },
      {
        title: lang.text("teacherAttendance"),
        url: "/attendance/teachers",
        icon: "User2",
      },
      {
        title: lang.text("coursePresences"),
        url: "/attendance/courses",
        icon: "Book",
      },
      {
        title: lang.text("history"),
        url: "/attendance/history",
        icon: "History",
      },
    ],
  },
  {
    title: lang.text("scanAttendanceMapel"),
    url: "/qr-scan",
    icon: "QrCode",
  },
  {
    title: lang.text("dataManagement"),
    url: "/data-management",
    icon: "Sheet",
    items: [
      {
        title: lang.text("school"),
        url: "/schools",
        icon: "School",
      },
      {
        title: lang.text("classRoom"),
        url: "/classrooms",
        icon: "Table",
      },
      {
        title: lang.text("course"),
        url: "/courses",
        icon: "Book",
      },
      {
        title: lang.text("scheduleMapel"),
        url: "/schedules",
        icon: "Book",
      },
      {
        title: lang.text("student"),
        url: "/students",
        icon: "Users",
      },
      {
        title: lang.text("event"),
        url: "/events",
        icon: "Calendar",
      },
      {
        title: lang.text("teacher"),
        url: "/teachers",
        icon: "User",
      },

      {
        title: lang.text("parent"),
        url: "/parents",
        icon: "Users",
      },

      {
        title: lang.text("graduation"),
        url: "/graduation",
        icon: "GraduationCap",
      },
    ],
  },

  // perizinan dispen
  {
    title: lang.text("locationDistribution"),
    url: "/locations",
    icon: "Map",
    items: [
      {
        title: lang.text("studentLocations"),
        url: "/location/students",
        icon: "User",
      },
    ],
  },
  {
    title: lang.text("LicensingData"),
    url: "/data-licensing",
    icon: "Sheet",
    items: [
      {
        title: lang.text("dispensation"),
        url: "/licensing",
        icon: "File",
      },
    ],
  },
  {
    title: lang.text("libraryManagement"),
    url: "/library",
    icon: "Book",
    items: [
      {
        title: lang.text("Library"),
        url: "/library",
        icon: "School",
      },
      {
        title: lang.text("LibraryVisit"),
        url: "/library/visit",
        icon: "Book",
      },
    ],
  },
  {
    title: lang.text("studentCard"),
    url: "/card",
    icon: "CreditCard",
    items: [
      {
        title: lang.text("generateCard"),
        url: "/card/generate",
        icon: "CreditCard",
      },
    ],
  },
  {
    title: lang.text("formatManagement"),
    url: "/format",
    icon: "FileArchive",
    items: [
      {
        title: lang.text("formatPDF"),
        url: "/format/pdf",
        icon: "UserCog",
      },
    ],
  },
  {
    title: lang.text("adminManagement"),
    url: "/admin",
    icon: "Shield",
    items: [
      {
        title: lang.text("userAdmin"),
        url: "/admin/users",
        icon: "UserCog",
      },
    ],
  },
];

export const USER_MENU_STAFF: VokadashProps["usermenus"] = [
  {
    title: lang.text("logout"),
    url: "/logout",
  },
];

export const MENU_CONFIG = {
  staff: MENU_STAFF,
};

export const USERMENU_CONFIG = {
  staff: USER_MENU_STAFF,
};
