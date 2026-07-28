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
import { StudentAttendanceTable } from "../containers";
import { useStudentAttendance } from "../hooks/useStudentAttedance";
import { io } from "socket.io-client";
import ExportFilterModal from "../components/ExpertFilterModal";
import { AttendanceFilter } from "../components/AttendanceFilter";
import { attendanceService } from "@/core/services/pagination";
import { useClassroom } from "@/features/classroom";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export const StudentAttendance = () => {
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

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  // const [filters, setFilters] = useState<
  //   "harian" | "mingguan" | "bulanan" | "tahunan"
  // >("harian");

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
      // filter: filters,
      // filter: filter.filter,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      type: "siswa",

      search: global,

      sortBy: sorting?.[0]?.id,
      sortOrder: sorting?.[0]?.desc ? "desc" : "asc",


      ...(filter.filter && { filter: filter.filter }),

      ...filter,
    }),
    [
      // filters,
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
  } = useStudentAttendance(attendanceParams);

  const filteredData = attendanceData?.data || [];

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    socket.on("absen", async (data) => {
      await refetch();
    });

    socket.on("absen-barcode", async (data) => {
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

  const classroom = useClassroom();
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
    link.download = "attendance-student.pdf";

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
      siteTitle={`${lang.text("studentAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text("studentAttendance"), url: "/students" },
      ]}
      title={lang.text("studentAttendance")}
    >
      <AttendanceFilter
        period={dataMode}
        attendanceCount={attendanceCount}
        setIsModalOpen={setIsModalOpen}
        onPeriodChange={(
          value: "harian" | "bulanan" | "mingguan" | "tahunan",
        ) => {
          // setDataMode(value);
          // setFilters(value);
        }}
      />

      <StudentAttendanceTable
        totalAttedance={true}
        data={filteredData}
        isLoading={isLoading || isFetching}
        global={global}
        setGlobal={setGlobal}
        sorting={sorting}
        onSortingChange={onSortingChange}
        filter={filter}
        onFilterChange={setFilter}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={attendanceData?.pagination?.total ?? 0}

      />
      <ExportFilterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataMode={(filter.filter ?? "harian") as
          | "harian"
          | "mingguan"
          | "bulanan"
          | "tahunan"}
        selectedStartMonth={selectedStartMonth}
        selectedEndMonth={selectedEndMonth}
        selectedClass={selectedClass}
        classOptions={classroom}
        setSelectedClass={setSelectedClass}
        setSelectedStartMonth={setSelectedStartMonth}
        setSelectedEndMonth={setSelectedEndMonth}
        handleExport={handleExport}
      />
    </DashboardPageLayout>
  );
};
