import { lang, simpleEncode } from "@/core/libs";
// import { ClassroomDataModel } from "@/core/models";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";

export const cardColumns = (
  columFilter?: BaseTableFilter,
  onEdit?: (id: number) => void,
): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "nomorKartu",
      accessorFn: (row) => row.nomorKartu,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("numberCards")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.nomorKartu}</span>;
      },
    },
    {
      accessorKey: "tipe",
      accessorFn: (row) => row.tipe,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("type")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.tipe}</span>;
      },
    },
    {
      accessorKey: "nomerNfc",
      accessorFn: (row) => row.nomerNfc,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("numberNfc")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.nomerNfc}</span>;
      },
    },
    // {
    //   accessorKey: "level",
    //   accessorFn: (row) => row.level,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {"Level"}
    //       </BaseTableHeader>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "Sekolah.namaSekolah",
    //   accessorFn: (row) => row.Sekolah?.namaSekolah,
    //   header: ({ column }) => {
    //     return (
    //       <BaseTableHeader
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         {"Sekolah"}
    //       </BaseTableHeader>
    //     );
    //   },
    //   meta: {
    //     filterLabel: lang.text("school"),
    //     filterPlaceholder: lang.text("selectSchool"),
    //     filterVariant: "select",
    //     filterOptions: columFilter?.schoolOptions || [],
    //   },
    // },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => {
        return null;
      },
      cell: ({ row }) => {
        const encryptPayload = simpleEncode(
          JSON.stringify({
            id: row.original.id,
            text: row.original.nomorKartu,
          }),
        );
        // // console.log(encryptPayload)
        // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
        return (
          <BaseActionTable
            // detailPath={`/classrooms/${encryptPayload}`}
            // editPath={`/cards/edit/${encryptPayload}`}
            onEdit={() => onEdit?.(row.original.id)}
            deletePath={`/cards/delete/${encryptPayload}`}
          />
        );
      },
    },
  ];
};

export const cardSFallback: any[] = [];
