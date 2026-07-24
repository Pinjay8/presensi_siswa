import { APP_CONFIG } from "@/core/configs";
import { Alert, AlertDescription, AlertTitle, lang } from "@/core/libs";
import { CardCounter, DashboardPageLayout } from "@/features/_global";
import {
  BookOpen,
  Building2,
  CircleAlert,
  GraduationCap,
  School,
  UserRound,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDashboard } from "../hooks/use-dashboard";
import { dashboardService } from "@/core/services/dashboard";
import { useProfile } from "@/features/profile";

export const SummaryHeaderSection = React.memo(() => {
  const [dashboard, setDashboard] = useState<any>();
  const profile = useProfile();
  const ROLE = profile.user?.role;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (!dashboard) return null;

    const cards = [
      {
        label: "Total " + lang.text("student"),
        value: dashboard.totalSiswa,
        infoText: "Siswa terdaftar",
        icon: GraduationCap,
      },
      {
        label: "Total " + lang.text("teacher"),
        value: dashboard.totalGuru,
        infoText: "Guru aktif",
        icon: Users,
      },
      {
        label: "Total " + lang.text("parent"),
        value: dashboard.totalOrangTua,
        infoText: "Orang tua",
        icon: UserRound,
      },
      {
        label: "Total " + lang.text("classroom"),
        value: dashboard.totalKelas,
        infoText: "Kelas tersedia",
        icon: School,
      },
      {
        label: "Total " + lang.text("course"),
        value: dashboard.totalMataPelajaran,
        infoText: "Mapel aktif",
        icon: BookOpen,
      },
      {
        label: "Total " + lang.text("school"),
        value: dashboard.totalSekolah,
        infoText: "Sekolah terdaftar",
        icon: Building2,
      },
    ];

    return cards.map((item, index) => (
      <CardCounter
        key={index}
        label={item.label}
        value={item.value}
        infoText={item.infoText}
        icon={item.icon}
      />
    ));
  };

  const renderContentTeacher = () => {
    if (!dashboard) return null;

    const cards = [
      {
        label: "Total Jadwal Mapel Hari Ini",
        value: dashboard.totalJadwalMapelHariIni,
        infoText: "Total Jadwal Mapel Hari Ini",
      },
      {
        label: "Total Jadwal Semua Mapel",
        value: dashboard.totalJadwalSemuaMapel,
        infoText: "Total Jadwal Semua Mapel",
      },
    ];

    return cards.map((item, index) => (
      <CardCounter
        key={index}
        label={item.label}
        value={item.value}
        infoText={item.infoText}
    
      />
    ));
  };
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      title={lang.text("OverallReport")}
    >
      <div>
        {/* {renderLoading()} */}
        {/* {renderError()} */}
        {ROLE === "superAdmin" ||
          (ROLE === "admin" && (
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {renderContent()}
            </div>
          ))}
        {ROLE === "guru" && (
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {renderContentTeacher()}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
});
