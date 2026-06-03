import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/core/libs"; // Impor dari Shadcn UI
import dayjs from "dayjs";

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

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "user.name",
    header: "Nama",
    cell: ({ row }) => row.original.user.name || "N/A",
    enableSorting: true,
    meta: { width: "25%" },
  },
  {
    accessorKey: "kelas.namaKelas",
    header: "Kelas",
    cell: ({ row }) => row.original.kelas.namaKelas || "N/A",
    enableSorting: true,
    meta: { width: "15%" },
  },
  {
    accessorKey: "attendance.namaMataPelajaran",
    header: "Mata Pelajaran",
    cell: ({ row }) => row.original.attendance.namaMataPelajaran || "N/A",
    enableSorting: true,
    meta: { width: "20%" },
  },
  {
    accessorKey: "attendance.statusKehadiran",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.attendance?.statusKehadiran || "N/A";
      let variant;

      if (status === "Hadir") {
        variant = "bg-green-600 text-white"; // Hijau untuk hadir
      } else if (status === "Alfa") {
        variant = "bg-red-600 text-white"; // Merah untuk alfa
      } else if (status === "izin") {
        variant = "bg-yellow-600 text-white"; // Kuning untuk izin
      }

      return <Badge className={`px-6 py-2 ${variant}`}>{status}</Badge>;
    },
    enableSorting: true,
    meta: { width: "15%" },
  },
  {
    accessorKey: "attendance.tanggal",
    header: "Tanggal",
    cell: ({ row }) =>
      dayjs(row.original.attendance.tanggal, "DD MMM YYYY, HH:mm:ss")
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY") || "N/A",
    enableSorting: true,
    meta: { width: "15%" },
  },
  // {
  //   accessorKey: "attendance.jamMasuk",
  //   header: "Jam Masuk",
  //   cell: ({ row }) =>
  //     dayjs(row.original.attendance.jamMasuk, "DD MMM YYYY, HH:mm:ss")
  //       .tz("Asia/Jakarta")
  //       .format("HH:mm:ss") || "N/A",
  //   enableSorting: true,
  //   meta: { width: "10%" },
  // },
  // {
  //   accessorKey: "attendance.jamPulang",
  //   header: "Jam Pulang",
  //   cell: ({ row }) =>
  //     dayjs(row.original.attendance.jamPulang, "DD MMM YYYY, HH:mm:ss")
  //       .tz("Asia/Jakarta")
  //       .format("HH:mm:ss") || "N/A",
  //   enableSorting: true,
  //   meta: { width: "10%" },
  // },
];
