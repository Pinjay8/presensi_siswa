import { ColumnDef } from "@tanstack/react-table";
import { Badge, simpleEncode } from "@/core/libs"; // Impor dari Shadcn UI
import dayjs from "dayjs";
import { BaseActionTable } from "@/features/_global";

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

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "namaSiswa",
    header: "Nama Siswa",
    cell: ({ row }) => row.original.namaSiswa || "-",
    enableSorting: true,
  },
  {
    accessorKey: "guru",
    header: " Guru",
    cell: ({ row }) => row.original.namaGuru || "-",
    enableSorting: true,
  },
  {
    accessorKey: "namaKelas",
    header: "Kelas",
    cell: ({ row }) => row.original.namaKelas || "-",
    enableSorting: true,
  },
  {
    accessorKey: "namaMataPelajaran",
    header: "Mata Pelajaran",
    cell: ({ row }) => row.original.namaMataPelajaran || "-",
    enableSorting: true,
  },
  {
    accessorKey: "jamMulai",
    header: "Jam Mulai",
    cell: ({ row }) => row.original.jamMulai || "-",
    enableSorting: true,
  },

  {
    accessorKey: "jamSelesai",
    header: "Jam Selesai",
    cell: ({ row }) => row.original.jamSelesai || "-",
    enableSorting: true,
  },

  {
    accessorKey: "attendance.statusKehadiran",
    header: "Status",
    // cell: ({ row }) => {
    //   const status = row.original.statusKehadiran || "-";
    //   let variant;

    //   if (status === "Hadir" || status === "hadir") {
    //     variant = "bg-green-600 text-white"; // Hijau untuk hadir
    //   } else if (status === "Alfa" || status === "alfa") {
    //     variant = "bg-red-600 text-white"; // Merah untuk alfa
    //   } else if (status === "izin") {
    //     variant = "bg-yellow-600 text-white"; // Kuning untuk izin
    //   }

    //   return (
    //     <Badge className={`px-6 py-2 ${variant} capitalize`}>{status}</Badge>
    //   );
    // },
    cell: ({ row }: any) => {
      const status = row.original.statusKehadiran?.toLowerCase();

      const statusConfig = {
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
          className: "bg-slate-100 text-slate-700 border border-slate-200",
        },
        sakit: {
          label: "Sakit",
          className: "bg-slate-100 text-slate-700 border border-slate-200",
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
    accessorKey: "attendance.tanggal",
    header: "Tanggal",
    cell: ({ row }) =>
      dayjs(row.original.tanggal, "DD MMM YYYY, HH:mm:ss")
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY") || "-",
    enableSorting: true,
  },
  //   {
  //     accessorKey: "id",
  //     accessorFn: (row) => row.id,
  //     size: 50,
  //     enableSorting: false,
  //     header: () => {
  //       return null;
  //     },
  //     cell: ({ row }) => {
  //       const encryptPayload = simpleEncode(
  //         JSON.stringify({ id: row.original.id, text: row.original.namaKelas }),
  //       );
  //       // // console.log(encryptPayload)
  //       // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
  //       return (
  //         <BaseActionTable
  //           detailPath={`/classrooms/${encryptPayload}`}
  //           editPath={`/classrooms/edit/${encryptPayload}`}
  //           deletePath={`/classrooms/delete/${encryptPayload}`}
  //         />
  //       );
  //     },
  //   },

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
