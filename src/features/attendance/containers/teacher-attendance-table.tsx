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
      <div className="w-full flex justify-between mb-4">
        <div className="flex justify-between items-center mb-4 space-x-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg transition duration-300"
            >
              {lang.text("export")} Data
              <FaFilePdf />
            </Button>
            <Select
              value={dataMode}
              onValueChange={(
                value: "harian" | "bulanan" | "mingguan" | "tahunan",
              ) => {
                setDataMode(value);
                setFilter(value);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih mode" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="harian">Harian</SelectItem>
                <SelectItem value="mingguan">Mingguan</SelectItem>
                <SelectItem value="bulanan">Bulanan</SelectItem>
                <SelectItem value="tahunan">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          aria-label="attendanceCount"
          className="hover:bg-transparent cursor-default"
        >
          {lang.text("present")}: {attendanceCount}
        </Button>
      </div>
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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Export & Filter</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pilih Rentang Bulan
              </label>
              <div className="flex space-x-4">
                <input
                  type="month"
                  value={selectedStartMonth}
                  onChange={(e) => setSelectedStartMonth(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                />
                <span className="text-white mt-2">-</span>
                <input
                  type="month"
                  value={selectedEndMonth}
                  onChange={(e) => setSelectedEndMonth(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExport("csv")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
              >
                Export Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 w-full"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
