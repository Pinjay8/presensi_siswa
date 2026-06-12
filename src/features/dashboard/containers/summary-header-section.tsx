import { APP_CONFIG } from "@/core/configs";
import { Alert, AlertDescription, AlertTitle, lang } from "@/core/libs";
import { CardCounter, DashboardPageLayout } from "@/features/_global";
import { CircleAlert } from "lucide-react";
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

  // const renderError = () => {
  //   if (dashboard.isError) {
  //     return (
  //       <Alert variant="destructive" className="mb-4">
  //         <CircleAlert className="h-4 w-4" />
  //         <AlertTitle>{lang.text("errorTitle")}</AlertTitle>
  //         <AlertDescription>{lang.text("errorDescription")}</AlertDescription>
  //       </Alert>
  //     );
  //   }

  //   return null;
  // };

  const renderContent = () => {
    if (!dashboard) return null;

    const cards = [
      {
        label: "Total Siswa",
        value: dashboard.totalSiswa,
        infoText: "Siswa terdaftar",
      },
      {
        label: "Total Guru",
        value: dashboard.totalGuru,
        infoText: "Guru aktif",
      },
      {
        label: "Total Orang Tua",
        value: dashboard.totalOrangTua,
        infoText: "Orang tua terhubung",
      },
      {
        label: "Total Kelas",
        value: dashboard.totalKelas,
        infoText: "Kelas tersedia",
      },
      {
        label: "Total Mata Pelajaran",
        value: dashboard.totalMataPelajaran,
        infoText: "Mapel aktif",
      },
      {
        label: "Total Sekolah",
        value: dashboard.totalSekolah,
        infoText: "Sekolah terdaftar",
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
