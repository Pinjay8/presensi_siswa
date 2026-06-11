import { APP_CONFIG } from "@/core/configs";
import { Button, lang } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import {
  useAlert,
  DashboardPageLayout,
  useDataTableController,
} from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { useSchoolDetail } from "@/features/schools";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { StudentAttendanceTable } from "../containers";
import { useBiodata } from "@/features/user";
import { FaFilePdf } from "react-icons/fa";
import { useStudentAttendance } from "../hooks/useStudentAttedance";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { attendanceService } from "@/core/services/pagination";
import { SubjectAttendanceTable } from "../containers/subject-attendance-table";
import { useMapelDaily } from "../hooks/useMapelDaily";

// Konfigurasi dayjs untuk timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export const SubjectAttendance = () => {
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataMode, setDataMode] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  const profile = useProfile();
  const alert = useAlert();
  const biodata = useBiodataNew(profile?.user?.sekolahId || 1);

  const biodataAll = useBiodata();

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const [filters, setFilter] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  // const {
  //   global,
  //   sorting,
  //   filter,
  //   pagination,
  //   onSortingChange,
  //   onPaginationChange,
  // } = useDataTableController({ defaultPageSize: 10 });

  const attendanceParams = {
    // filter: filters,
    page: 1,
    limit: 100,
    // type: "siswa",
  };

  const {
    data: attendanceData,
    isLoading,
    isFetching,
    refetch,
  } = useMapelDaily(attendanceParams);

  const filteredData = attendanceData?.data || [];

  useEffect(() => {
    const socket = io("https://presensi-api.app.bio-experience.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("absen", async (data) => {
      await refetch();
    });

    socket.on("absen-barcode", async (data) => {
      console.log("[BARCODE]", data);

      await refetch();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("error", (err) => {
      console.error("[ERROR]", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  // const handleExport = async (format: "csv" | "excel" | "pdf") => {
  //   if (!filteredData.length) {
  //     alert.error("Tidak ada data untuk diekspor.");
  //     return;
  //   }

  //   const exportData = filteredData.map((item: any, index: number) => ({
  //     No: index + 1,
  //     Nama: item.siswa?.nama ?? "",
  //     NISN: item.siswa?.nisn ?? "",
  //     Kelas: item.siswa?.kelas ?? "N/A",
  //     Sekolah: item.siswa?.sekolah ?? "N/A",
  //     StatusKehadiran: item.statusKehadiran ?? "N/A",
  //     JamMasuk: formatDateTime(item.jamMasuk),
  //     JamPulang: formatDateTime(item.jamPulang),
  //   }));

  //   const fileName = `attendance_data_${dataMode}_${dayjs().format("YYYYMMDD")}`;

  //   switch (format) {
  //     case "csv": {
  //       const csv = Papa.unparse(exportData, {
  //         delimiter: ";",
  //       });

  //       const blob = new Blob([csv], {
  //         type: "text/csv;charset=utf-8;",
  //       });

  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `${fileName}.csv`;
  //       link.click();
  //       break;
  //     }

  //     case "excel": {
  //       const wb = XLSX.utils.book_new();
  //       const ws = XLSX.utils.json_to_sheet(exportData);

  //       XLSX.utils.book_append_sheet(wb, ws, `Attendance-${dataMode}`);

  //       XLSX.writeFile(wb, `${fileName}.xlsx`);
  //       break;
  //     }

  //     case "pdf": {
  //       let period: string | undefined;

  //       switch (dataMode) {
  //         case "mingguan":
  //           period = `${dayjs()
  //             .startOf("week")
  //             .format("DD MMM YYYY")} - ${dayjs()
  //             .endOf("week")
  //             .format("DD MMM YYYY")}`;
  //           break;

  //         case "bulanan":
  //           period = dayjs(selectedStartMonth).format("MMMM YYYY");
  //           break;

  //         case "tahunan":
  //           period = dayjs().format("YYYY");
  //           break;

  //         default:
  //           period = undefined;
  //       }

  //       await generateStudentAttendancePDF({
  //         attendanceData: exportData,
  //         alert,
  //         schoolData: schoolData || {},
  //         schoolIsLoading,
  //         mode: dataMode,
  //         date:
  //           dataMode === "harian"
  //             ? dayjs().tz("Asia/Jakarta").format("DD MMMM YYYY")
  //             : undefined,
  //         period,
  //       });

  //       break;
  //     }
  //   }

  //   setIsModalOpen(false);
  // };

  const studentList = Array.isArray(
    dataMode === "harian" ? biodata.data : biodataAll.data,
  )
    ? dataMode === "harian"
      ? biodata.data
      : biodataAll.data
    : [];

  const classOptions = Array.from(
    new Map(
      (biodataAll.data ?? []).map((student: any) => [
        student.kelas?.id,
        {
          id: student.kelas?.id,
          name: student.kelas?.namaKelas,
        },
      ]),
    ).values(),
  );
  const attendanceCount = filteredData.length;

  const handleExportExcel = async (params: any) => {
    const blob = await attendanceService.exportExcel(params);

    const fileUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "attendance.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };
  const handleExportPdf = async (params: any) => {
    const blob = await attendanceService.exportPdf(params);

    const fileUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "attendance.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const handleExport = async (type: "csv" | "excel" | "pdf") => {
    const params = {
      ...attendanceParams,

      ...(selectedClass && {
        kelasId: selectedClass.id,
      }),

      ...(selectedStartMonth && {
        startMonth: selectedStartMonth,
      }),

      ...(selectedEndMonth && {
        endMonth: selectedEndMonth,
      }),
    };

    if (type === "excel") {
      handleExportExcel(params);
      return;
    }

    if (type === "pdf") {
      // await attendanceService.exportPdf(params);
      handleExportPdf(params);
      return;
    }
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("SubjectAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text("SubjectAttendance"), url: "/subject-attendance" },
      ]}
      title={lang.text("SubjectAttendance")}
    >
      {/* <AttendanceFilter
        period={dataMode}
        attendanceCount={attendanceCount}
        setIsModalOpen={setIsModalOpen}
        onPeriodChange={(
          value: "harian" | "bulanan" | "mingguan" | "tahunan",
        ) => {
          setDataMode(value);
          setFilter(value);
        }}
      /> */}

      <SubjectAttendanceTable totalAttedance={true} data={filteredData} />
      {/* <ExportFilterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataMode={dataMode}
        selectedStartMonth={selectedStartMonth}
        selectedEndMonth={selectedEndMonth}
        selectedClass={selectedClass}
        classOptions={classOptions}
        setSelectedClass={setSelectedClass}
        setSelectedStartMonth={setSelectedStartMonth}
        setSelectedEndMonth={setSelectedEndMonth}
        handleExport={handleExport}
      /> */}
    </DashboardPageLayout>
  );
};
