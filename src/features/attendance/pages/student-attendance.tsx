import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useAlert, DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { useSchoolDetail } from "@/features/schools";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Document,
  Image,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { StudentAttendanceTable } from "../containers";
import { useBiodata } from "@/features/user";
import { FaFilePdf } from "react-icons/fa";

// Konfigurasi dayjs untuk timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  header: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
  },
  headerImage: {
    width: 595,
    maxHeight: 150,
    objectFit: "contain",
  },
  contentWrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  content: {
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  signature: {
    marginTop: 50,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: "auto",
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
  },
});

// PDF Component for Student Attendance
const StudentAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: {
    kopSurat: string | undefined;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  mode: "daily" | "monthly";
  date?: string;
  period?: string;
}> = ({ attendanceData, schoolData, mode, date, period }) => {
  const kopSuratUrl = schoolData.kopSurat
    ? schoolData.kopSurat.startsWith("data:image")
      ? schoolData.kopSurat
      : `data:image/png;base64,${schoolData.kopSurat}`
    : undefined;

  const signatureUrl = schoolData.ttdKepalaSekolah
    ? schoolData.ttdKepalaSekolah.startsWith("data:image")
      ? schoolData.ttdKepalaSekolah
      : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
    : undefined;

  const rowsPerPage = 25;
  const dataChunks = [];
  for (let i = 0; i < attendanceData.length; i += rowsPerPage) {
    const chunk = attendanceData.slice(i, i + rowsPerPage);
    if (chunk.length > 0) {
      dataChunks.push(chunk);
    }
  }

  return (
    <Document>
      {dataChunks.map((chunk, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={pdfStyles.page}
          break={pageIndex > 0}
        >
          <View style={pdfStyles.header} fixed>
            {kopSuratUrl ? (
              <Image
                src={getStaticFile(kopSuratUrl)}
                style={pdfStyles.headerImage}
              />
            ) : (
              <Text style={{ textAlign: "center", fontSize: 12 }}>
                Kop Surat Tidak Tersedia
              </Text>
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Siswa</Text>
            <Text style={pdfStyles.content}>
              Mode: {mode === "daily" ? "Harian" : "Bulanan"}
            </Text>
            <Text style={pdfStyles.content}>
              {mode === "daily"
                ? `Tanggal: ${date || "Tanggal Tidak Diketahui"}`
                : `Periode: ${period || "Periode Tidak Diketahui"}`}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {[
                  "No",
                  "Nama",
                  "NISN",
                  "Kelas",
                  "Sekolah",
                  "Status",
                  "Jam Masuk",
                  "Jam Pulang",
                ].map((header, index) => (
                  <View
                    key={index}
                    style={[
                      pdfStyles.tableCell,
                      pdfStyles.tableHeader,
                      {
                        width:
                          index === 0
                            ? "5%"
                            : index === 1
                              ? "20%"
                              : index === 2
                                ? "15%"
                                : index === 3
                                  ? "10%"
                                  : index === 4
                                    ? "15%"
                                    : index === 5
                                      ? "10%"
                                      : "15%",
                      },
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: "5%" }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                    <Text>{item?.Nama || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.NISN || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item?.Kelas || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.Sekolah || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item?.StatusKehadiran || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.JamMasuk || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.JamPulang || "-"}</Text>
                  </View>
                </View>
              ))}
            </View>
            {pageIndex === dataChunks.length - 1 && (
              <View style={pdfStyles.signature}>
                <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                {signatureUrl && (
                  <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                )}
                <Text style={pdfStyles.signatureText}>
                  {schoolData.namaKepalaSekolah || "Nama Kepala Sekolah"}
                </Text>
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Function to generate PDF
const generateStudentAttendancePDF = async ({
  attendanceData,
  alert,
  schoolData,
  schoolIsLoading,
  mode,
  date,
  period,
}: {
  attendanceData: any[];
  alert:
    | { success: (msg: string) => void; error: (msg: string) => void }
    | undefined;
  schoolData: any;
  schoolIsLoading: boolean;
  mode: "daily" | "monthly";
  date?: string;
  period?: string;
}) => {
  if (!alert) {
    console.error("Alert system is not available");
    return;
  }

  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (
    !attendanceData ||
    !Array.isArray(attendanceData) ||
    attendanceData.length === 0
  ) {
    alert.error("Tidak ada data kehadiran untuk dihasilkan.");
    return;
  }

  if (!schoolData || !schoolData.namaSekolah) {
    alert.error("Data sekolah tidak lengkap.");
    return;
  }

  if (!schoolData.kopSurat) {
    alert.error(
      "Kop surat tidak tersedia, laporan akan dibuat tanpa kop surat.",
    );
  }

  try {
    const doc = (
      <StudentAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: schoolData.namaSekolah || "Nama Sekolah",
          kopSurat: schoolData.kopSurat || undefined,
          namaKepalaSekolah:
            schoolData.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
        }}
        mode={mode}
        date={date}
        period={period}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan-Kehadiran-Siswa-${mode}-${dayjs().format("YYYYMMDD")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Laporan kehadiran siswa berhasil diunduh.");
  } catch (error) {
    console.error("Error generating attendance PDF:", error);
    alert.error("Gagal menghasilkan laporan kehadiran siswa.");
  }
};

export const StudentAttendance = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataMode, setDataMode] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  const profile = useProfile();
  const alert = useAlert();
  const biodata = useBiodataNew(profile?.user?.sekolahId || 1);
  // console.log("biodata:", biodata.data);
  const biodataAll = useBiodata();
  const { data: schoolData, isLoading: schoolIsLoading } = useSchoolDetail({
    id: profile?.user?.sekolahId || 1,
  });

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").startOf("month").format("YYYY-MM"),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm:ss")
      : "N/A";
  };

  const filteredData = useMemo(() => {
    const biodataList = Array.isArray(biodata.data?.data)
      ? biodata.data.data
      : [];

    const biodataAllList = Array.isArray(biodataAll.data)
      ? biodataAll.data
      : typeof biodataAll.data === "string"
        ? JSON.parse(biodataAll.data)
        : [];
    if (dataMode === "daily") {
      if (!biodataList.length) return [];

      const today = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");

      const flatData =
        biodataList?.flatMap((student: any) =>
          student.absensis
            ?.filter((attendance: any) => {
              const attendanceDate = dayjs(attendance.jamMasuk)
                .tz("Asia/Jakarta")
                .format("YYYY-MM-DD");

              return attendanceDate === today;
            })
            .map((attendance: any) => ({
              ...student,
              attendance: {
                ...attendance,
                jamMasuk: formatTime(attendance.jamMasuk),
                jamPulang: formatTime(attendance.jamPulang),
              },
            })),
        ) || [];

      const result = flatData.filter((student: any) => {
        const match = selectedClass
          ? student.kelas?.namaKelas === selectedClass
          : true;

        return match;
      });

      return result;
    } else {
      if (!biodataAllList.length) return [];

      return biodataAllList
        .flatMap((student: any) =>
          student.absensis
            ?.filter((attendance: any) =>
              dayjs(attendance.jamMasuk)
                .tz("Asia/Jakarta")
                .isBetween(
                  dayjs(selectedStartMonth).startOf("month"),
                  dayjs(selectedEndMonth).endOf("month"),
                  null,
                  "[]",
                ),
            )
            .map((attendance: any) => ({
              ...student,
              attendance: {
                ...attendance,
                jamMasuk: formatTime(attendance.jamMasuk),
                jamPulang: formatTime(attendance.jamPulang),
              },
            })),
        )
        .filter((student: any) =>
          selectedClass ? student.kelas?.namaKelas === selectedClass : true,
        );
    }
  }, [
    dataMode,
    biodata.data,
    biodataAll.data,
    selectedStartMonth,
    selectedEndMonth,
    selectedClass,
  ]);

  // console.log("filtered data:", filteredData);

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    if (filteredData.length === 0) {
      alert.error("Tidak ada data untuk diekspor.");
      return;
    }

    const exportData = filteredData.map((data: any, index: number) => ({
      No: index + 1,
      Nama: data.user?.name || "",
      NISN: data.user?.nisn || "",
      Kelas: data.kelas?.namaKelas || "N/A",
      Sekolah: data.user?.sekolah?.namaSekolah || "N/A",
      StatusKehadiran: data.attendance?.statusKehadiran || "N/A",
      JamMasuk: data.attendance?.jamMasuk,
      JamPulang: data.attendance?.jamPulang,
    }));

    if (format === "csv") {
      const csv = Papa.unparse(exportData, { delimiter: ";" });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `attendance_data_${dataMode}_${dayjs().format("YYYYMMDD")}.csv`;
      link.click();
    } else if (format === "excel") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      XLSX.writeFile(
        wb,
        `attendance_data_${dataMode}_${dayjs().format("YYYYMMDD")}.xlsx`,
      );
    } else if (format === "pdf") {
      await generateStudentAttendancePDF({
        attendanceData: exportData,
        alert,
        schoolData: schoolData || {},
        schoolIsLoading,
        mode: dataMode,
        date:
          dataMode === "daily"
            ? dayjs().tz("Asia/Jakarta").format("DD MMMM YYYY")
            : undefined,
        period:
          dataMode === "monthly"
            ? `${dayjs(selectedStartMonth).format("MMMM, YYYY")}`
            : undefined,
      });
    }

    setIsModalOpen(false);
  };

  const studentList = Array.isArray(
    dataMode === "daily" ? biodata.data : biodataAll.data,
  )
    ? dataMode === "daily"
      ? biodata.data
      : biodataAll.data
    : [];

  // const classOptions = Array.from(

  //   new Set(
  //     (dataMode === 'daily' ? biodata.data : biodataAll.data)?.map(
  //       (student) => student.kelas?.namaKelas
  //     ) || []
  //   )
  // );

  const classOptions = Array.from(
    new Set(studentList?.map((student: any) => student.kelas?.namaKelas)),
  );

  const attendanceCount = filteredData.length;

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("studentAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: lang.text("studentAttendance"), url: "/students" },
      ]}
      title={lang.text("studentAttendance")}
    >
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
            onValueChange={(value: "daily" | "monthly") => setDataMode(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          aria-label="attendanceCount"
          className="hover:bg-transparent cursor-default"
        >
          Hadir: {attendanceCount}
        </Button>
      </div>
      <StudentAttendanceTable totalAttedance={true} data={filteredData} />
      <div className="pb-16 sm:pb-0" />

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Export & Filter</h2>
            {dataMode === "monthly" && (
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
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pilih Kelas
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded-lg w-full border border-gray-700"
              >
                <option value="">Semua Kelas</option>
                {classOptions.map((kelas: any) => (
                  <option key={kelas} value={kelas}>
                    {kelas}
                  </option>
                ))}
              </select>
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
    </DashboardPageLayout>
  );
};
