import { lang, simpleEncode } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const ekstrakurikulerColumns = ({
  schoolOptions = [],
  classroomOptions = [],
  onEdit, // Add onEdit callback
  onDelete,
}: BaseTableFilter & {
  onEdit?: (course: any) => void;
  onDelete?: (course: any) => void;
}): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "nama",
      accessorFn: (row) => row.nama,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("name")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.nama}</span>;
      },
    },
    {
      accessorKey: "lokasi",
      accessorFn: (row) => row.lokasi,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("location")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.lokasi}</span>;
      },
    },
    {
      accessorKey: "pembina",
      accessorFn: (row) => row.pembina.namaGuru,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("advisor")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.pembina.namaGuru}</span>;
      },
    },
    // {
    //   accessorKey: "type",
    //   accessorFn: (row) => row.tipe,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {lang.text("type")}
    //       </BaseTableHeader>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const typeMap: Record<string, string> = {
    //       mata_pelajaran: "Mata Pelajaran",
    //       ekstrakulikuler: "Ekstrakulikuler",
    //     };

    //     return <span>{typeMap[row.original.tipe] || row.original.tipe}</span>;
    //   },
    // },
    // {
    //   accessorKey: "sekolah.namaSekolah",
    //   accessorFn: (row) => row.sekolah?.namaSekolah,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {lang.text("school")}
    //       </BaseTableHeader>
    //     );
    //   },
    //   meta: {
    //     filterLabel: lang.text("school"),
    //     filterPlaceholder: lang.text("selectSchool"),
    //     filterVariant: "select",
    //     filterOptions: schoolOptions,
    //   },
    // },
    // {
    //   accessorKey: "kelas",
    //   accessorFn: (row) => row.kelas?.namaKelas,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {lang.text("className")}
    //       </BaseTableHeader>
    //     );
    //   },
    //   // meta: {
    //   //   filterLabel: lang.text("className"),
    //   //   filterPlaceholder: lang.text("selectClassRoom"),
    //   //   filterVariant: "select",
    //   //   filterOptions: schoolOptions,
    //   // },
    // },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => lang.text("action"),
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original.id,
            text: row.original.nama,
          }),
        );
        return (
          <BaseActionTable
            // detailPath={`/ekstrakurikuler/${encryptPayload}`}
            onEdit={() => onEdit?.(row.original)} // Trigger onEdit callback
            // deletePath={`/courses/delete/${encryptPayload}`}
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    },
  ];
};

export const courseDataFallback: CourseDataModel[] = [];
