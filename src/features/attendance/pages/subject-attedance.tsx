import { APP_CONFIG } from "@/core/configs";
import { Button, lang } from "@/core/libs";
import {
  useAlert,
  DashboardPageLayout,
  useDataTableController,
} from "@/features/_global";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo, useState } from "react";
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
  const [dataMode, setDataMode] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const [filters, setFilters] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  const {
    global,
    setGlobal,
    sorting,
    filter,
    setFilter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
    defaultSorting: [{ id: "createdAt", desc: true }],
  });

  const attendanceParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,

      search: global,

      sortBy: sorting?.[0]?.id,
      sortDir: sorting?.[0]?.desc ? "desc" : "asc",

      ...filter,
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      global,
      sorting,
      filter,
    ],
  );

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
      <SubjectAttendanceTable
        totalAttedance={true}
        data={filteredData}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        isLoading={isLoading || isFetching}
        rowCount={attendanceData?.pagination?.total ?? 0}

        global={global}
        setGlobal={setGlobal}

        sorting={sorting}
        onSortingChange={onSortingChange}

        setFilter={setFilter}
      />
    </DashboardPageLayout>
  );
};
