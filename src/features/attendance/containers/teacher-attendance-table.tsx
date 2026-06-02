import { Button, dayjs, distinctObjectsByProperty, lang } from "@/core/libs";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useBiodataGuru } from "@/features/user/hooks";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import Papa from 'papaparse';
import { useMemo, useState } from "react";
import * as XLSX from 'xlsx';
import { teacherAttendanceColumn } from "../utils";

interface attedanceProps {
  totalAttedance?: boolean
}

export function TeacherAttendanceTable({totalAttedance}: attedanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').startOf('month').format('YYYY-MM'),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(
    dayjs().tz('Asia/Jakarta').format('YYYY-MM'),
  );

  const biodata = useBiodataGuru();
  const school = useSchool();

  const datas = useMemo(() => {
    const dataWithAttendance: BiodataGuru[] = [];

    biodata.data?.forEach((user) => {
      user.absensis?.forEach((att) => {
        dataWithAttendance.push({
          ...user,
          attendance: att,
        });
      });
    });

    return dataWithAttendance;
  }, [biodata.data]);

  // console.log('data guru:', datas)

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
    const today = dayjs().format('YYYY-MM-DD'); // Get today's date (e.g., "2025-05-02")
    return datas.filter((data: any) => {
      const recordDate = dayjs(data.attendance.createdAt).format('YYYY-MM-DD');
      return recordDate === today; // Compare with today's date
    });
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (datas.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    // Define the start and end dates for filtering
    const startDate = dayjs(`${selectedStartMonth}-01`).startOf('month');
    const endDate = dayjs(`${selectedEndMonth}-01`).endOf('month');

    // Filter data based on the selected month range
    const filteredData = datas.filter((data) => {
      const attendanceDate = dayjs(data.attendance?.createdAt);
      return attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate);
    });

    if (filteredData.length === 0) {
      alert('Tidak ada data dalam rentang waktu yang dipilih.');
      return;
    }

    // Helper function to format date
    const formatDateTime = (isoString: string | undefined) => {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const exportData = filteredData.map((data, index) => ({
      No: index + 1,
      NamaGuru: data?.namaGuru || 'N/A',
      JamMasuk: formatDateTime(data.attendance?.jamMasuk),
      JamPulang: formatDateTime(data.attendance?.jamPulang),
      StatusKehadiran: data.attendance?.statusKehadiran || 'N/A',
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(exportData, { delimiter: ';' });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'attendance_data.csv';
      link.click();
    } else if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      XLSX.writeFile(wb, 'attendance_data.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text('Teacher Attendance Report', 14, 20);

      // Add date range
      doc.setFontSize(10);
      doc.text(
        `Period: ${selectedStartMonth} to ${selectedEndMonth}`,
        14,
        30
      );

      // Configure table
      autoTable(doc, {
        startY: 34,
        head: [['No', 'Nama Guru', 'Jam Masuk', 'Jam Pulang', 'Status Kehadiran']],
        body: exportData.map(item => [
          item.No,
          item.NamaGuru,
          item.JamMasuk,
          item.JamPulang,
          item.StatusKehadiran,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 2 },
      });

      doc.save('Laporan-kehadiran-guru.pdf');
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(!isModalOpen)}
          aria-label="exportData"
          className="w-max"
        >
          {lang.text('export')} Data
        </Button>

        <Button
          variant="outline"
          aria-label="presentCount"
          className="w-max hover:bg-transparent cursor-default"
        >
          Hadir: {dayAttends().length > 0 ? dayAttends().length : 0}
        </Button>
      </div>
      <BaseDataTable
        columns={columns}
        data={datas}
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
              id: "attendance_createdAt",
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
            className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg"
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
                onClick={() => handleExport('csv')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 w-full"
              >
                Export Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
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