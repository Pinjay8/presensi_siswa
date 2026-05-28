import { Avatar, AvatarFallback, AvatarImage, Button, lang, simpleEncode } from "@/core/libs"
import {
  BiodataSiswa
} from "@/core/models/biodata"
import { getStaticFile } from "@/core/utils"
import {
  BaseActionTable,
  BaseTableHeader
} from "@/features/_global"
import { buildSelectFilter } from "@/features/_global/components/use-table-column-filter"
import { ColumnDef } from "@tanstack/react-table"
import { FaFilePdf } from "react-icons/fa"
interface FlatStudentModel {
  id: number;
  name: string;
  email: string;
  nis: string;
  nisn: string;
  rfid: string;
  image: string;
  kelas: {
    id: number;
    namaKelas: string;
  };
  sekolah: {
    namaSekolah: string;
    sekolahId: number;
  };
  lulus: boolean;
  idBiodataSiswa?: number;
}

// export const graduationColumnWithFilter = ({
//   schoolOptions = [],
//   classroomOptions = [],
// }: {
//   schoolOptions?: { label: string; value: string | number }[];
//   classroomOptions?: { label: string; value: string | number }[];
// }): ColumnDef<FlatStudentModel>[] => {
//   const classroomFilterMeta = buildSelectFilter(
//     "kelas?.namaKelas", // Ubah ke akses langsung
//     lang.text("classroom"),
//     classroomOptions
//   );

//   return [
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <BaseTableHeader
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {lang.text("studentName")}
//         </BaseTableHeader>
//       ),
//       enableGlobalFilter: true,
//       cell: ({ row }) => {
//         const nameArr = row.original?.user?.name?.split(" ") || [];
//         const initials =
//           nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
//         return (
//           <div className="flex flex-row items-center gap-2">
//             <Avatar>
//               <AvatarImage
//                 src={getStaticFile(String(row.original?.user?.image || row.original?.user?.name))}
//                 alt={row.original?.user?.name}
//               />
//               <AvatarFallback>{initials}</AvatarFallback>
//             </Avatar>
//             <p>{row.original?.user?.name || '-'}</p>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "email",
//       header: () => <BaseTableHeader>{lang.text("email")}</BaseTableHeader>,
//       cell: ({ row }) => <span>{row.original?.user?.email || '-'}</span>,
//     },
//     {
//       accessorKey: "nis",
//       header: () => <BaseTableHeader>NIS</BaseTableHeader>,
//       cell: ({ row }) => <span>{row.original?.user?.nis ? String(row.original?.user?.nis) : '-'}</span>,
//     },
//     {
//       accessorKey: "nisn",
//       header: () => <BaseTableHeader>NISN</BaseTableHeader>,
//       cell: ({ row }) => <span>{row.original?.user?.nisn ? String(row.original?.user?.nisn) : '-'}</span>,
//     },
//     {
//       ...classroomFilterMeta,
//       accessorFn: (row) => row.original.kelas?.namaKelas || "-",
//       id: "idKelas", // Harus cocok dengan yang dipakai untuk filtering
//       filterFn: (row, columnId, filterValue) => {
//         return row.original.kelas?.namaKelas === filterValue;
//       },
//       header: () => <BaseTableHeader>{lang.text("classroom")}</BaseTableHeader>,
//       cell: ({ row }) => <span>{row.original.kelas?.namaKelas || "-"}</span>,
//     },
//     {
//       accessorKey: "lulus",
//       header: () => <BaseTableHeader>Status</BaseTableHeader>,
//       cell: ({ row }) => (
//         <div
//           className={`w-[100px] text-center px-3 py-1 rounded-sm ${
//             row.original?.lulus ? 'bg-[#0f4d3f] text-[#3ee07a]' : 'bg-red-700 text-red-300'
//           }`}
//         >
//           {row.original?.lulus ? 'Lulus' : 'Belum lulus'}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "id",
//       enableSorting: false,
//       header: () => null,
//       cell: ({ row }) => {
//         const encryptPayload = simpleEncode(
//           JSON.stringify({
//             id: row.original?.user?.idBiodataSiswa || row.original?.user?.id,
//             biodataId: row.original?.user?.id,
//             text: row.original?.user?.name,
//           })
//         );
//         return (
//           <BaseActionTable
//             detailPath={`/students/${encryptPayload}`}
//             editPath={`/students/edit/${encryptPayload}`}
//           />
//         );
//       },
//     },
//   ];
// };

export const graduationColumnWithFilter = ({
  schoolOptions = [],
  classroomOptions = [],
  onDownloadPDF, // New prop to handle PDF download
}: {
  schoolOptions?: { label: string; value: string | number }[];
  classroomOptions?: { label: string; value: string | number }[];
  onDownloadPDF?: (student: FlatStudentModel) => void; // Callback for downloading PDF
}): ColumnDef<FlatStudentModel>[] => {
  const classroomFilterMeta = buildSelectFilter(
    "kelas?.namaKelas",
    lang.text("classroom"),
    classroomOptions
  );

  return [
    // ... Existing columns remain unchanged ...
    {
      accessorKey: "name",
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("studentName")}
        </BaseTableHeader>
      ),
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original?.user?.name?.split(" ") || [];
        const initials =
          nameArr?.[0]?.[0]?.toUpperCase() + (nameArr?.[1]?.[0]?.toUpperCase() || "");
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={getStaticFile(String(row.original?.user?.image || row.original?.user?.name))}
                alt={row.original?.user?.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p>{row.original?.user?.name || '-'}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => <BaseTableHeader>{lang.text("email")}</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original?.user?.email || '-'}</span>,
    },
    {
      accessorKey: "nis",
      header: () => <BaseTableHeader>NIS</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original?.user?.nis ? String(row.original?.user?.nis) : '-'}</span>,
    },
    {
      accessorKey: "nisn",
      header: () => <BaseTableHeader>NISN</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original?.user?.nisn ? String(row.original?.user?.nisn) : '-'}</span>,
    },
    {
      ...classroomFilterMeta,
      accessorFn: (row) => row.original.kelas?.namaKelas || "-",
      id: "idKelas",
      filterFn: (row, columnId, filterValue) => {
        return row.original.kelas?.namaKelas === filterValue;
      },
      header: () => <BaseTableHeader>{lang.text("classroom")}</BaseTableHeader>,
      cell: ({ row }) => <span>{row.original.kelas?.namaKelas || "-"}</span>,
    },
    {
      accessorKey: "lulus",
      header: () => <BaseTableHeader>Status</BaseTableHeader>,
      cell: ({ row }) => (
        <div
          className={`w-[100px] text-center px-3 py-1 rounded-sm ${
            row.original?.lulus ? 'bg-[#0f4d3f] text-[#3ee07a]' : 'bg-red-700 text-red-300'
          }`}
        >
          {row.original?.lulus ? 'Lulus' : 'Belum lulus'}
        </div>
      ),
    },
    {
      id: "downloadPDF",
      enableSorting: false,
      header: () => <BaseTableHeader>Download</BaseTableHeader>,
      cell: ({ row }) => {
        return(
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          variant="outline"
          aria-label="download student pdf"
          onClick={() => onDownloadPDF?.(row.original)}
          disabled={!row.original?.lulus} // Disable if student hasn't passed
        >
          <p>Surat kelulusan</p>
          <FaFilePdf />
        </Button>
      )},
    },
    // {
    //   accessorKey: "id",
    //   enableSorting: false,
    //   header: () => null,
    //   cell: ({ row }) => {
    //     const encryptPayload = simpleEncode(
    //       JSON.stringify({
    //         id: row.original?.user?.idBiodataSiswa || row.original?.user?.id,
    //         biodataId: row.original?.user?.id,
    //         text: row.original?.user?.name,
    //       })
    //     );
    //     return (
    //       <BaseActionTable
    //         detailPath={`/students/${encryptPayload}`}
    //         // editPath={`/students/edit/${encryptPayload}`}
    //       />
    //     );
    //   },
    // },
  ];
};

export const tableColumnSiswaFallback: BiodataSiswa[] = []
