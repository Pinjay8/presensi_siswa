import { MonthlyAttendancePDF } from "./MonthlyAttendancePDF";
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";

// Fungsi untuk menghasilkan PDF absensi bulanan
export const generateMonthlyAttendancePDF = async ({
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
  console.log("atttw", attendanceData);
  if (schoolIsLoading) {
    alert.error("Data sekolah masih dimuat, silakan coba lagi.");
    return;
  }

  if (!attendanceData || attendanceData.length === 0) {
    alert.error("Tidak ada data absensi untuk dihasilkan.");
    return;
  }

  // Proses data absensi untuk menghitung jumlah hadir, izin, sakit, dan alpa per siswa
  const monthlyData = attendanceData.reduce((acc, item) => {
    const studentId = item?.id;
    if (!acc[studentId]) {
      acc[studentId] = {
        user: item,
        // kelas: item.kelas,
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
      };
    }
    if (item.status === "Hadir") acc[studentId].hadir += 1;
    else if (item.status === "Izin") acc[studentId].izin += 1;
    else if (item.status === "Sakit") acc[studentId].sakit += 1;
    else if (item.status === "Alpa") acc[studentId].alpa += 1;
    return acc;
  }, {});

  const formattedData = Object.values(monthlyData);
  console.log("formattte", formattedData);

  try {
    const doc = (
      <MonthlyAttendancePDF
        attendanceData={formattedData}
        schoolData={{
          namaSekolah: nameSchool,
          kopSurat: schoolData?.kopSurat || "",
          namaKepalaSekolah:
            schoolData?.namaKepalaSekolah || "Nama Kepala Sekolah",
          ttdKepalaSekolah: schoolData?.ttdKepalaSekolah,
        }}
        month={dayjs().format("MMMM YYYY")}
      />
    );

    const pdfInstance = pdf(doc);
    const pdfBlob = await pdfInstance.toBlob();

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan-Absensi-Bulanan-${dayjs().format("YYYY-MM")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert.success("Laporan absensi bulanan berhasil diunduh.");
  } catch (error) {
    console.error("Error generating monthly attendance PDF:", error);
    alert.error("Gagal menghasilkan laporan absensi bulanan.");
  }
};
