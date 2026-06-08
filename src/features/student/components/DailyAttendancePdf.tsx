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

export const DailyAttendancePDF: React.FC<{
  attendanceData: any[];
  schoolData: {
    kopSurat: string;
    namaSekolah: string;
    namaKepalaSekolah: string;
    ttdKepalaSekolah: string | undefined;
  };
  date: string;
}> = ({ attendanceData, schoolData, date }) => {
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
          break={pageIndex > 0} // Page break untuk halaman setelah pertama
        >
          <View style={pdfStyles.header} fixed>
            <Image
              src={getStaticFile(kopSuratUrl || "")}
              style={pdfStyles.headerImage}
            />
          </View>
          <View style={pdfStyles.contentWrapper}>
            <Text style={pdfStyles.title}>Laporan Absensi Harian</Text>
            <Text style={pdfStyles.content}>
              Tanggal: {date || "Tanggal Tidak Diketahui"}
            </Text>
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                {["No", "Nama Siswa", "NIS", "Kelas", "Status"].map(
                  (header, index) => (
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
                                ? "30%"
                                : index === 2
                                  ? "20%"
                                  : index === 3
                                    ? "20%"
                                    : "25%",
                        },
                      ]}
                    >
                      <Text>{header}</Text>
                    </View>
                  ),
                )}
              </View>
              {chunk.map((item, index) => (
                <View style={pdfStyles.tableRow} key={index} wrap={false}>
                  <View style={[pdfStyles.tableCell, { width: "5%" }]}>
                    <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "30%" }]}>
                    <Text>{item?.name || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                    <Text>{item?.nis || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "20%" }]}>
                    <Text>{item?.namaKelas || "-"}</Text>
                  </View>
                  <View style={[pdfStyles.tableCell, { width: "25%" }]}>
                    <Text>{item.status || "-"}</Text>
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
