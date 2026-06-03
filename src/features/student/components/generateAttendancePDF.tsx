import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { DailyAttendancePDF } from "./DailyAttendancePdf";

// Fungsi untuk menghasilkan PDF absensi harian
export const generateAttendancePDF = async ({
  studentParams,
  attendanceData,
  alert,
  nameSchool,
  schoolData,
  schoolIsLoading,
}: {
  studentParams: any;
  attendanceData: any[];
  alert: any;
  nameSchool: string;
  schoolData: any;
  schoolIsLoading: boolean;
}) => {
  console.log("attendanceData", attendanceData);
  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (!attendanceData || attendanceData.length === 0) {
    alert.error("Tidak ada data absensi untuk dihasilkan.");
    return;
  }

  try {
    const doc = (
      <DailyAttendancePDF
        attendanceData={attendanceData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || "",
          namaKepalaSekolah:
            schoolData?.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        date={dayjs().format("DD MMMM YYYY")}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan-Absensi-Harian-${dayjs().format("YYYY-MM-DD")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Laporan absensi harian berhasil diunduh.");
  } catch (error) {
    console.error("Error generating daily attendance PDF:", error);
    alert.error("Gagal menghasilkan laporan absensi harian.");
  }
};
