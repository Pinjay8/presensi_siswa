import {
  Button,
  dayjs,
  distinctObjectsByProperty,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { BaseDataTable, useDataTableController } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useBiodataGuru } from "@/features/user/hooks";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { teacherAttendanceColumn } from "../utils";
import { FaFilePdf } from "react-icons/fa";
import { useStudentAttendance } from "../hooks/useStudentAttedance";
import { io } from "socket.io-client";
import { AttendanceFilter } from "../components/AttendanceFilter";
import { TeacherExportModal } from "../components/TeacherExportDialog";
import { attendanceService } from "@/core/services/pagination";
import { schoolService } from "@/core/services";
import { classroomService } from "@/core/services/classroom";

interface attedanceProps {
  totalAttedance?: boolean;
}

export function TeacherAttendanceTable({ totalAttedance }: attedanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const biodata = useBiodataGuru();
  const school = useSchool();

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
  } = useDataTableController({
    defaultPageSize: 10,
  });

  const attendanceParams = {
    filter: filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    type: "guru",
  };
  const {
    data: attendanceData,
    isLoading,
    isFetching,
    refetch,
  } = useStudentAttendance(attendanceParams);

  useEffect(() => {
    const socket = io("https://presensi-api.app.bio-experience.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
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
    link.download = "attendance.pdf";

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
          setFilter(value);
        }}
      />

      <BaseDataTable
        columns={columns}
        data={filteredData}
        dataFallback={[]}
        globalSearch
        searchParamPagination
        showFilterButton
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={attendanceData?.pagination?.total ?? 0}
        initialState={{
          columnVisibility: {
            user_email: false,
            user_nrk: false,
            user_nip: false,
            user_nikki: false,
          },
          sorting: [
            {
              id: "createdAt",
              desc: true,
            },
          ],
        }}
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
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
