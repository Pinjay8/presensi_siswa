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
import { useStudentAttendance } from "../hooks/useStudentAttedance";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import ExportFilterModal from "../components/ExpertFilterModal";
import { AttendanceFilter } from "../components/AttendanceFilter";

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

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  return dayjs(value).tz("Asia/Jakarta").format("DD MMM YYYY HH:mm:ss");
};

// PDF Component for Student Attendance
const StudentAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: {
    kopSurat: string | undefined;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  mode: any;
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
                {/* Kop Surat Tidak Tersedia */}
              </Text>
            )}
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Kehadiran Siswa</Text>
            <Text style={pdfStyles.content}>
              Mode: {mode === "harian" ? "Harian" : "Bulanan"}
            </Text>
            <Text style={pdfStyles.content}>
              {mode === "harian"
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
  mode: "harian" | "bulanan" | "tahunan" | "mingguan";
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
  const [dataMode, setDataMode] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

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

  const {
    data: attendanceData,
    isLoading,
    isFetching,
    refetch,
  } = useStudentAttendance({
    filter: filters,
    page: 1,
    limit: 100,
    type: "siswa",
  });

  const filteredData = attendanceData?.data || [];

  useEffect(() => {
    const socket = io("http://192.168.1.116:15219", {
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

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    if (!filteredData.length) {
      alert.error("Tidak ada data untuk diekspor.");
      return;
    }

    const exportData = filteredData.map((item: any, index: number) => ({
      No: index + 1,
      Nama: item.siswa?.nama ?? "",
      NISN: item.siswa?.nisn ?? "",
      Kelas: item.siswa?.kelas ?? "N/A",
      Sekolah: item.siswa?.sekolah ?? "N/A",
      StatusKehadiran: item.statusKehadiran ?? "N/A",
      JamMasuk: formatDateTime(item.jamMasuk),
      JamPulang: formatDateTime(item.jamPulang),
    }));

    const fileName = `attendance_data_${dataMode}_${dayjs().format("YYYYMMDD")}`;

    switch (format) {
      case "csv": {
        const csv = Papa.unparse(exportData, {
          delimiter: ";",
        });

        const blob = new Blob([csv], {
          type: "text/csv;charset=utf-8;",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        link.click();
        break;
      }

      case "excel": {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.book_append_sheet(wb, ws, `Attendance-${dataMode}`);

        XLSX.writeFile(wb, `${fileName}.xlsx`);
        break;
      }

      case "pdf": {
        let period: string | undefined;

        switch (dataMode) {
          case "mingguan":
            period = `${dayjs()
              .startOf("week")
              .format("DD MMM YYYY")} - ${dayjs()
              .endOf("week")
              .format("DD MMM YYYY")}`;
            break;

          case "bulanan":
            period = dayjs(selectedStartMonth).format("MMMM YYYY");
            break;

          case "tahunan":
            period = dayjs().format("YYYY");
            break;

          default:
            period = undefined;
        }

        await generateStudentAttendancePDF({
          attendanceData: exportData,
          alert,
          schoolData: schoolData || {},
          schoolIsLoading,
          mode: dataMode,
          date:
            dataMode === "harian"
              ? dayjs().tz("Asia/Jakarta").format("DD MMMM YYYY")
              : undefined,
          period,
        });

        break;
      }
    }

    setIsModalOpen(false);
  };

  const studentList = Array.isArray(
    dataMode === "harian" ? biodata.data : biodataAll.data,
  )
    ? dataMode === "harian"
      ? biodata.data
      : biodataAll.data
    : [];

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

      <StudentAttendanceTable totalAttedance={true} data={filteredData} />
      <ExportFilterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataMode={dataMode}
        selectedStartMonth={selectedStartMonth}
        selectedEndMonth={selectedEndMonth}
        selectedClass={selectedClass}
        classOptions={classOptions as string[]}
        setSelectedStartMonth={setSelectedStartMonth}
        setSelectedEndMonth={setSelectedEndMonth}
        setSelectedClass={setSelectedClass}
        handleExport={handleExport}
      />
    </DashboardPageLayout>
  );
};
