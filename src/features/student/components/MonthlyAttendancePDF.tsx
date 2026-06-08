import { getStaticFile } from "@/core/utils";

import {
  Document,
  Image,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { pdfStyles } from "../components/pdfStylles";

// Komponen PDF untuk Laporan Absensi Bulanan
export const MonthlyAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: {
    kopSurat: string;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  month: string;
}> = ({ attendanceData, schoolData, month }) => {
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

  // Bagi data menjadi kelompok untuk setiap halaman
  const rowsPerPage = 25; // Jumlah baris per halaman
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
            <Image
              src={getStaticFile(kopSuratUrl || "")}
              style={pdfStyles.headerImage}
            />
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Bulanan</Text>
            <Text style={pdfStyles.content}>
              Bulan: {month || "Bulan Tidak Diketahui"}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {[
                  "No",
                  "Nama Siswa",
                  "NIS",
                  "Kelas",
                  "Hadir",
                  "Izin",
                  "Sakit",
                  "Alpa",
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
                              ? "25%"
                              : index === 2
                                ? "15%"
                                : index === 3
                                  ? "15%"
                                  : "10%",
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
                  <View style={[pdfStyles.tableCell, { width: "25%" }]}>
                    <Text>{item?.user?.name || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.user?.nis || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "15%" }]}>
                    <Text>{item?.user?.namaKelas || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.hadir || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.izin || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.sakit || 0}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "10%" }]}>
                    <Text>{item.alpa || 0}</Text>
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
