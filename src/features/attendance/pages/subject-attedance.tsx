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

  // const profile = useProfile();
  // const alert = useAlert();
  // const biodata = useBiodataNew(profile?.user?.sekolahId || 1);

  // const biodataAll = useBiodata();

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const [filters, setFilter] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 10 });

  const attendanceParams = {
    // filter: filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global.search,
  };

  const {
    data: attendanceData,
    isLoading,
    isFetching,
    refetch,
  } = useMapelDaily(attendanceParams);

  const filteredData = attendanceData?.data || [];

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

      <SubjectAttendanceTable
        totalAttedance={true}
        data={filteredData}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={attendanceData?.pagination?.total ?? 0}
      />
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
