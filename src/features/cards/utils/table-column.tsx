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
  onDelete?: (id: number) => void,
): ColumnDef<any>[] => {
  const availabilityConfig = {
    tersedia: {
      label: "available",
      className: "bg-green-50 text-green-600 border-green-200",
    },
    digunakan: {
      label: "inUse",
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    hilang: {
      label: "lost",
      className: "bg-red-50 text-red-600 border-red-200",
    },
    rusak: {
      label: "damaged",
      className: "bg-orange-50 text-orange-600 border-orange-200",
    },
  };
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
      accessorKey: "ketersediaan",
      accessorFn: (row) => row.ketersediaan,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("Availability")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const status =
          availabilityConfig[
            row.original.ketersediaan as keyof typeof availabilityConfig
          ];

        if (!status) {
          return <span>{row.original.ketersediaan}</span>;
        }

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
          >
            {lang.text(status.label)}
          </span>
        );
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
      header: () => lang.text("action"),
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
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    },
  ];
};

export const cardSFallback: any[] = [];
