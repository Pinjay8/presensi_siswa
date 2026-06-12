import { lang } from "@/core/libs";
import { Box, Divider, IconButton } from "@mui/material";
import { XIcon } from "lucide-react";

interface TeacherExportModalProps {
  open: boolean;
  onClose: () => void;
  selectedStartMonth: string;
  selectedEndMonth: string;
  setSelectedStartMonth: (value: string) => void;
  setSelectedEndMonth: (value: string) => void;
  onExport: (type: "csv" | "excel" | "pdf") => void;
  selectedClass?: any;
  classOptions?: any;
  setSelectedClass?: any;
}

export const TeacherExportModal = ({
  open,
  onClose,
  selectedStartMonth,
  selectedEndMonth,
  setSelectedStartMonth,
  setSelectedEndMonth,
  onExport,
  selectedClass,
  classOptions,
  setSelectedClass,
}: TeacherExportModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 text-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0 }}
        >
          <h2 className="text-black text-lg font-semibold">Export & Filter</h2>
          <IconButton onClick={onClose}>
            <XIcon className="text-black" />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-black">
            {lang.text("selectPeriod")}
          </label>

          <div className="flex items-center gap-4">
            <input
              type="month"
              value={selectedStartMonth}
              onChange={(e) => setSelectedStartMonth(e.target.value)}
              className="w-full rounded-lg border border-gray-700  p-2 text-black bg-white"
            //   style={{ colorScheme: "dark" }}
            />

            <span>-</span>

            <input
              type="month"
              value={selectedEndMonth}
              onChange={(e) => setSelectedEndMonth(e.target.value)}
              className="w-full rounded-lg border border-gray-700  p-2 text-black bg-white"
            //   style={{ colorScheme: "dark" }}
            />
          </div>
        </div> */}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black">
            {lang.text("chooseClassroom")}
          </label>

          <select
            value={selectedClass?.id ?? ""}
            onChange={(e) => {
              const selected = classOptions?.find(
                (kelas: any) => kelas.id === Number(e.target.value),
              );

              setSelectedClass(selected ?? null);
            }}
            className="w-full rounded-lg border border-gray-700 p-2 text-black"
          >
            <option value="">{lang.text("allClassRoom")}</option>

            {classOptions?.map((kelas: any) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.namaKelas}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          {/* <button
            onClick={() => onExport("csv")}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Export CSV
          </button> */}

          <button
            onClick={() => onExport("excel")}
            className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            Export Excel
          </button>

          <button
            onClick={() => onExport("pdf")}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};
