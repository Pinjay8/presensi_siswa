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
import { BaseDataTable } from "@/features/_global";
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

  const dayAttends = () => {
    const today = dayjs().format("YYYY-MM-DD"); // Get today's date (e.g., "2025-05-02")
    return attendanceData.filter((data: any) => {
      const recordDate = dayjs(data.attendance.createdAt).format("YYYY-MM-DD");
      return recordDate === today; // Compare with today's date
    });
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    const startDate = dayjs(`${selectedStartMonth}-01`).startOf("month");
    const endDate = dayjs(`${selectedEndMonth}-01`).endOf("month");

    // Filter data based on the selected month range
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const exportFilteredData = filteredData.filter((data: any) => {
      const attendanceDate = dayjs(data.createdAt);

      return (
        attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate)
      );
    });

    if (filteredData.length === 0) {
      alert("Tidak ada data dalam rentang waktu yang dipilih.");
      return;
    }

    // Helper function to format date
    const formatDateTime = (isoString: string | undefined) => {
      if (!isoString) return "N/A";
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const exportData = exportFilteredData.map((data: any, index: any) => ({
      No: index + 1,
      NamaGuru: data?.guru.namaGuru || "N/A",
      JamMasuk: formatDateTime(data.jamMasuk),
      JamPulang: formatDateTime(data.jamPulang),
      StatusKehadiran: data.statusKehadiran || "N/A",
    }));

    if (format === "csv") {
      const csv = Papa.unparse(exportData, { delimiter: ";" });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "attendance_data.csv";
      link.click();
    } else if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      XLSX.writeFile(wb, "attendance_data.xlsx");
    } else if (format === "pdf") {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("Teacher Attendance Report", 14, 20);

      // Add date range
      doc.setFontSize(10);
      doc.text(`Period: ${selectedStartMonth} to ${selectedEndMonth}`, 14, 30);

      // Configure table
      autoTable(doc, {
        startY: 34,
        head: [
          ["No", "Nama Guru", "Jam Masuk", "Jam Pulang", "Status Kehadiran"],
        ],
        body: exportData.map((item: any) => [
          item.No,
          item.NamaGuru,
          item.JamMasuk,
          item.JamPulang,
          item.StatusKehadiran,
        ]),
        theme: "grid",
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 2 },
      });

      doc.save("Laporan-kehadiran-guru.pdf");
    }

    setIsModalOpen(false);
  };

  const [dataMode, setDataMode] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  const [filter, setFilter] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  const {
    data: attendanceData,
    isLoading,
    isFetching,
    refetch,
  } = useStudentAttendance({
    filter,
    page: 1,
    limit: 100,
    type: "guru",
  });

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
      />
    </>
  );
}
