interface ExportFilterModalProps {
  open: boolean;
  onClose: () => void;
  dataMode: string;
  selectedStartMonth: string;
  selectedEndMonth: string;
  selectedClass: string;
  classOptions: string[];
  setSelectedStartMonth: (value: string) => void;
  setSelectedEndMonth: (value: string) => void;
  setSelectedClass: (value: string) => void;
  handleExport: (type: "csv" | "excel" | "pdf") => void;
}

const ExportFilterModal = ({
  open,
  onClose,
  dataMode,
  selectedStartMonth,
  selectedEndMonth,
  selectedClass,
  classOptions,
  setSelectedStartMonth,
  setSelectedEndMonth,
  setSelectedClass,
  handleExport,
}: ExportFilterModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-gray-900 p-6 text-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">Export & Filter</h2>

        {dataMode === "mingguan" && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Pilih Rentang Bulan
            </label>

            <div className="flex space-x-4">
              <input
                type="month"
                value={selectedStartMonth}
                onChange={(e) => setSelectedStartMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
              />

              <span className="mt-2">-</span>

              <input
                type="month"
                value={selectedEndMonth}
                onChange={(e) => setSelectedEndMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Pilih Kelas</label>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
          >
            <option value="">Semua Kelas</option>

            {classOptions.map((kelas) => (
              <option key={kelas} value={kelas}>
                {kelas}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleExport("csv")}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Export CSV
          </button>

          <button
            onClick={() => handleExport("excel")}
            className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            Export Excel
          </button>

          <button
            onClick={() => handleExport("pdf")}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportFilterModal;
