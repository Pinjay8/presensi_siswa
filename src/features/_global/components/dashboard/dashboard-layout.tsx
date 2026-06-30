import { Button, cn, lang } from "@/core/libs";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { fetchCalendarEvents } from "@/features/events";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import { useBiodata } from "@/features/user";
import {
  Bell,
  Loader2,
  Maximize,
  Menu,
  MessageSquare,
  Mic,
  Minimize,
  Send,
  X,
} from "lucide-react";
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LangToggle } from "../lang-toggle";
import { ThemeToggle } from "../theme-toggle";
import { Sidebar } from "./sidebar";
import { SidebarProps } from "./sidebar/types";
import { UserMenu, UserMenuProps } from "./usermenu";
import Notification from "../Notification";
import { Typography } from "@mui/material";
import { useSidebarContext } from "../../hooks";
import { SidebarContext } from "../../context";
import { Chatbot } from "./Chatbot";

export interface DashboardLayoutProps extends PropsWithChildren {
  menus: SidebarProps["menus"];
  usermenus: UserMenuProps["menus"];
  sidebarClassName?: string;
  headerClassName?: string;
}

export const DashboardLayout = React.memo(
  ({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
    const [sidebarVisible, setSidebarVisible] = useState(false); // Ubah default ke true agar sidebar terlihat saat pertama load
    const [visible, setVisible] = useState(true); // Ubah default ke true agar sidebar terlihat saat pertama load
    const profile = useProfile();
    const resource = useClassroom();
    const school = useSchool();
    const student = useBiodata();
    const course = useCourse();
    const [classRoom, setCreateClassRoom] = useState(false);
    const [events, setEvents] = useState([]);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const allowedMenusStudent = [
      "dashboard",
      "scanAttendanceMapel",
      "dataManagement",
    ];

    const loadEvents = async () => {
      try {
        const response = await fetchCalendarEvents();
        setEvents(response?.data);
        if (!response || !response.data) {
          console.error("❌ Error: Data tidak ditemukan dalam response API.");
          return;
        }
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      }
    };

    useEffect(() => {
      loadEvents();
    }, []);

    const filteredMenus = useMemo(() => {
      const role = profile?.user?.role;

      if (!role) return [];

      return menus
        .map((data) => {
          if (
            role === "superAdmin" &&
            data.title === "Manajemen Perpustakaan"
          ) {
            return null;
          }

          if (
            role === "siswa" &&
            ![
              "Dashboard",
              lang.text("scanAttendanceMapel"),
              lang.text("dataManagement"),
            ].includes(data.title ?? "")
          ) {
            return null;
          }

          if (
            (role === "admin" && data.title === "Scan Kehadiran Mapel") ||
            data.title === "Scan Attendance Schedule" ||
            data.title === lang.text("cardStudent")
          ) {
            return null;
          }

          if (
            role === "guru" &&
            ![
              "Dashboard",
              lang.text("dataManagement"),
              lang.text("attendanceManagement"),
              lang.text("LicensingData"),
            ].includes(data.title ?? "")
          ) {
            return null;
          }

          if (
            role === "orangTua" &&
            ![
              "Dashboard",
              lang.text("attendanceManagement"),
              lang.text("dataManagement"),
              lang.text("LicensingData"),
            ].includes(data.title ?? "")
          ) {
            return null;
          }

          if (data.items) {
            const filteredItems = data.items.filter((item) => {
              if (
                role === "superAdmin" &&
                ["Acara", "Kelulusan"].includes(item.title ?? "")
              ) {
                return false;
              }

              if (
                role === "siswa" &&
                [
                  lang.text("school"),
                  lang.text("event"),
                  lang.text("student"),
                  lang.text("teacher"),
                  lang.text("parent"),
                  lang.text("graduation"),
                  lang.text("cards"),
                  lang.text("classRoom"),
                  lang.text("course"),
                  lang.text("ekstrakurikuler"),
                ].includes(item.title ?? "")
              ) {
                return false;
              }

              if (
                role === "admin" &&
                ["Riwayat", "History", "Pengguna Admin", "Admin User"].includes(
                  item.title ?? "",
                )
              ) {
                return false;
              }

              if (
                role === "orangTua" &&
                [
                  lang.text("teacherAttendance"),
                  lang.text("school"),
                  lang.text("event"),
                  lang.text("teacher"),
                  lang.text("parent"),
                  lang.text("history"),
                  lang.text("classRoom"),
                  lang.text("course"),
                  lang.text("cards"),
                ].includes(item.title ?? "")
              ) {
                return false;
              }

              if (
                role === "guru" &&
                [
                  lang.text("school"),
                  lang.text("event"),
                  lang.text("history"),
                  lang.text("classRoom"),
                  lang.text("cards"),
                ].includes(item.title ?? "")
              ) {
                return false;
              }

              return true;
            });

            return filteredItems.length
              ? { ...data, items: filteredItems }
              : null;
          }

          return data;
        })
        .filter(Boolean);
    }, [menus, profile?.user?.role]);

    return (
      <div className="dashboard-layout grid min-h-[100svh] w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
        <Sidebar.Default
          menus={filteredMenus}
          className={props.sidebarClassName}
          visible={visible}
        />
        <div className="sidebar-content flex flex-col overflow-hidden">
          <header
            className={cn(
              "sidebar-header flex h-14 items-center gap-1 border-b bg-muted-foreground/5 px-4 lg:h-[60px] lg:px-6",
              props.headerClassName,
            )}
          >
            <div className="hidden lg:block relative z-[99] border border-white/10 overflow-hidden rounded-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVisible(!visible)}
                className="w-max flex items-center px-4 overflow-hidden"
                title={visible ? "Hide Sidebar" : "Show Sidebar"}
              >
                {visible ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
                <p>{visible ? "Hide Sidebar" : "Show Sidebar"}</p>
              </Button>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarVisible((v) => !v)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button> */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => sidebarContext.setVisible(true)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button> */}
            <SidebarContext.Provider
              value={{
                visible: sidebarVisible,
                setVisible: () => setSidebarVisible((v) => !v),
              }}
            >
              <Sidebar.Sheet
                className={props.sidebarClassName}
                menus={filteredMenus}
              />
            </SidebarContext.Provider>
            <div className="w-full flex-1">
              {/* Search form (jika diaktifkan) */}
            </div>

            <div>
              <Typography
                className="lg:mr-1 "
                sx={{ fontSize: "14px", marginRight: "5px", marginBottom: "0" }}
              >
                {profile?.user?.sekolah?.namaSekolah ?? "-"}
              </Typography>
            </div>
            <Notification />
            <ThemeToggle />
            <LangToggle />
            <UserMenu menus={usermenus} />
          </header>
          <div className="sidebar-layout-main max-h-svh overflow-y-auto flex flex-1 flex-col gap-4 pb-10">
            <div className="gap-4 flex-1 flex flex-col p-4 lg:gap-6 lg:p-6">
              {children}

              {/* Tombol toggle untuk chatbot */}
              {profile?.user?.role !== "Superadmin" && (
                <>
                  <button
                    onClick={() => setIsChatbotVisible((prev) => !prev)}
                    className="fixed w-16 h-16 border border-white z-[22] flex items-center justify-center bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
                    aria-label={
                      isChatbotVisible ? "Hide Chatbot" : "Show Chatbot"
                    }
                  >
                    {isChatbotVisible ? (
                      <X size={40} />
                    ) : (
                      <MessageSquare size={40} />
                    )}
                  </button>

                  <Chatbot
                    classroomData={resource.data}
                    schoolData={school.data}
                    studentData={student.data}
                    studentDetailData={student}
                    courseData={course.data}
                    profileData={profile}
                    setCreateClassRoom={setCreateClassRoom}
                    classRoom={classRoom}
                    events={events}
                    show={isChatbotVisible}
                    setShow={setIsChatbotVisible}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

DashboardLayout.displayName = "DashboardLayout";
