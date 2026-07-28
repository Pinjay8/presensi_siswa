import {
  Button,
  dayjs,
  distinctObjectsByProperty,
  lang,
} from "@/core/libs";
import { BaseDataTable, useDataTableController } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useBiodataGuru } from "@/features/user/hooks";
import "jspdf-autotable";
import { useEffect, useMemo, useState } from "react";
import { teacherAttendanceColumn } from "../utils";
import { useStudentAttendance } from "../hooks/useStudentAttedance";
import { io } from "socket.io-client";
import { AttendanceFilter } from "../components/AttendanceFilter";
import { TeacherExportModal } from "../components/TeacherExportDialog";
import { attendanceService } from "@/core/services/pagination";
import { classroomService } from "@/core/services/classroom";
import { useClassroom } from "@/features/classroom";

interface attedanceProps {
  totalAttedance?: boolean;
}

export function TeacherAttendanceTable({ totalAttedance }: attedanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const biodata = useBiodataGuru();
  const school = useSchool();
  const classroom = useClassroom();

  const columns = useMemo(
    () =>
      teacherAttendanceColumn({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      }),
    [school.data],
  );

  const [dataMode, setDataMode] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

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
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      type: "guru",

      search: global,

      sortBy: sorting?.[0]?.id,
      sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
      ...(filter.filter && { filter: filter.filter }),
      ...filter,
    }),
    [
      filter,
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

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("absen", async (data) => {
      await refetch();
    });

    socket.on("absen-barcode", async (data) => {
      // console.log("[BARCODE]", data);

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

  const filteredData = attendanceData?.data || [];
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
    link.download = "attendance-teacher.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
      handleExportPdf(params);
      return;
    }
  };

  const [classOptions, setClassOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await classroomService.all();

      setClassOptions(res?.data || []);
    };
    fetchData();
  }, []);

  const isPeriodSelected = !!filter?.filter;

  return (
    <>
      <AttendanceFilter
        period={dataMode}
        attendanceCount={attendanceCount}
        setIsModalOpen={setIsModalOpen}
        onPeriodChange={(
          value: "harian" | "bulanan" | "mingguan" | "tahunan",
        ) => {
          setDataMode(value);
          // setFilters(value);
        }}
      />

      <BaseDataTable
        columns={columns}
        data={filteredData}
        dataFallback={columns}
        globalSearch
        searchParamPagination
        showFilterButton
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={attendanceData?.pagination?.total ?? 0}
        globalFilter={global}
        onGlobalFilterChange={setGlobal}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onFilterChange={setFilter}
        searchPlaceholder={lang.text("search") + " " + lang.text("teacher")}
        isLoading={biodata.query.isLoading}
        filters={[
          {
            id: "filter",
            label: lang.text("period"),
            variant: "select",
            placeholder: lang.text("selectPeriod"),
            options: [
              { label: lang.text("daily"), value: "harian" },
              { label: lang.text("yesterday"), value: "kemarin" },
              { label: lang.text("weeks"), value: "mingguan" },
              { label: lang.text("lastWeek"), value: "minggu_lalu" },
              { label: lang.text("months"), value: "bulanan" },
              { label: lang.text("lastMonth"), value: "bulanan_lalu" },
              { label: lang.text("years"), value: "tahunan" },
              { label: lang.text("lastYear"), value: "tahunan_lalu" },
            ],
          },
          {
            id: "startDate",
            label: lang.text("startDate"),
            variant: "date",
            disabled: isPeriodSelected,
          },
          {
            id: "endDate",
            label: lang.text("endDate"),
            variant: "date",
            disabled: isPeriodSelected,
          },
          {
            id: "kelasId",
            label: lang.text("classroom"),
            variant: "select",
            options: classroom.data?.map((d) => ({
              label: d.namaKelas,
              value: d.id,
            })),
          },
          {
            id: "statusKehadiran",
            label: lang.text("attendanceStatus"),
            variant: "select",
            options: [
              {
                label: lang.text("present"),
                value: "hadir",
              },
              {
                label: lang.text("late"),
                value: "terlambat",
              },
              {
                label: lang.text("alfa"),
                value: "alfa",
              },
              {
                label: lang.text("sick"),
                value: "sakit",
              },
              {
                label: lang.text("permit"),
                value: "izin",
              },
            ],
          },
        ]}
      />

      <TeacherExportModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedStartMonth={selectedStartMonth}
        selectedEndMonth={selectedEndMonth}
        setSelectedStartMonth={setSelectedStartMonth}
        setSelectedEndMonth={setSelectedEndMonth}
        onExport={handleExport}
        selectedClass={selectedClass}
        classOptions={classOptions as string[]}
        setSelectedClass={setSelectedClass}
      />
    </>
  );
}
