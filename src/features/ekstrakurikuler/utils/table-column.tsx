import { lang, simpleEncode } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { useProfile } from "@/features/profile";
import { ColumnDef } from "@tanstack/react-table";

export const ekstrakurikulerColumns = ({
  isAdmin,
  onEdit,
  onDelete,
}: BaseTableFilter & {
  isAdmin?: boolean;
  onEdit?: (course: any) => void;
  onDelete?: (course: any) => void;
}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nama",
      accessorFn: (row) => row.nama,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("name")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.nama,
    },
    {
      accessorKey: "jenis",
      accessorFn: (row) => row.jenis,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("jenis")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.jenis,
    },
    {
      accessorKey: "lokasi",
      accessorFn: (row) => row.lokasi,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("location")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.lokasi,
    },
    {
      accessorKey: "pembina",
      accessorFn: (row) => row.pembina.namaGuru,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("advisor")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.pembina.namaGuru,
    },
  ];

  if (isAdmin) {
    columns.push({
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
            detailPath={`/ekstrakurikuler/${encryptPayload}`}
            onEdit={() => onEdit?.(row.original)}
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    });
  }

  return columns;
};

export const courseDataFallback: CourseDataModel[] = [];
