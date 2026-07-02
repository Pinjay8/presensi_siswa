import { ColumnDef } from "@tanstack/react-table";
import { Badge, lang, simpleEncode } from "@/core/libs"; // Impor dari Shadcn UI
import dayjs from "dayjs";
import { BaseActionTable } from "@/features/_global";
import { Button } from "@mui/material";

export interface Attendance {
  user: {
    image: string;
    name: string;
    nisn: string;
  };
  kelas: {
    namaKelas: string;
  };
  attendance: {
    statusKehadiran: string;
    namaMataPelajaran: string;
    tanggal: string;
    jamMasuk: string;
    jamPulang: string;
  };
}

export const matpelColumns = (
  onSubmitAttendance: (
    row: any,
    status: "hadir" | "sakit" | "alfa" | "terlambat",
  ) => void,
  isRole?: any,
): ColumnDef<any>[] => [
  {
    accessorKey: "namaSiswa",
    header: lang.text("studentName"),
    cell: ({ row }) => row.original.namaSiswa || "N/A",
    enableSorting: true,
  },
  {
    accessorKey: "guru",
    header: lang.text("teacher"),
    cell: ({ row }) => row.original.namaGuru || "-",
    enableSorting: true,
  },
  {
    accessorKey: "namaKelas",
    header: lang.text("classroom"),
    cell: ({ row }) => row.original.namaKelas || "N/A",
    enableSorting: true,
  },
  {
    accessorKey: "namaMataPelajaran",
    header: lang.text("course"),
    cell: ({ row }) => row.original.namaMataPelajaran || "N/A",
    enableSorting: true,
  },
  {
    accessorKey: "attendance.statusKehadiran",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.original.statusKehadiran?.toLowerCase();
      console.log("Status:", status); // Debugging: Log the status value

      const statusConfig: Record<string, { label: string; className: string }> =
        {
          hadir: {
            label: "Hadir",
            className: "bg-green-100 text-green-700 border border-green-200",
          },
          izin: {
            label: "Izin",
            className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
          },
          alfa: {
            label: "Alfa",
            className: "bg-red-100 text-red-700 border border-red-200",
          },
          "belum hadir": {
            label: "Belum Hadir",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
          terlambat: {
            label: "Terlambat",
            className: "bg-orange-100 text-orange-700 border border-orange-200",
          },
          sakit: {
            label: "Sakit",
            className: "bg-blue-100 text-blue-700 border border-blue-200",
          },
        };

      const config = statusConfig[status as keyof typeof statusConfig];

      return (
        <div
          className={`inline-flex min-w-[110px] justify-center rounded-full px-3 py-1 text-xs font-medium ${
            config?.className ??
            "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {config?.label ?? "-"}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "jamMulai",
    header: lang.text("startHour"),
    cell: ({ row }) => row.original.jamMulai || "-",
    enableSorting: true,
  },
  {
    accessorKey: "jamSelesai",
    header: lang.text("endHour"),
    cell: ({ row }) => row.original.jamSelesai || "-",
    enableSorting: true,
  },
  {
    accessorKey: "attendance.tanggal",
    header: lang.text("date"),
    cell: ({ row }) =>
      dayjs(row.original.tanggal, "DD MMM YYYY, HH:mm:ss")
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY") || "N/A",
    enableSorting: true,
  },
  ...(isRole
    ? [
        {
          accessorKey: "id",
          header: lang.text("action"),
          enableSorting: false,
          cell: ({ row }) => {
            const status =
              row.original.statusKehadiran?.toLowerCase() || "belum hadir";
            if (status !== "belum hadir") {
              return null;
            }
            return (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="contained"
                  // color="success"

                  onClick={() => onSubmitAttendance(row.original, "hadir")}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "#22C55E",
                  }}
                >
                  {lang.text("present")}
                </Button>

                <Button
                  variant="contained"
                  // color="#0EA5E9"

                  onClick={() => onSubmitAttendance(row.original, "sakit")}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "#0EA5E9",
                  }}
                >
                  {lang.text("sick")}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onSubmitAttendance(row.original, "alfa")}
                  sx={{ textTransform: "capitalize" }}
                >
                  {lang.text("alfa")}
                </Button>

                <Button
                  variant="contained"
                  // color="info"

                  onClick={() => onSubmitAttendance(row.original, "terlambat")}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "#64748B",
                  }}
                >
                  {lang.text("late")}
                </Button>
              </div>
            );
          },
        },
      ]
    : []),
];
