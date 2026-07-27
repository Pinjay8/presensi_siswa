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
      id: "no",
      header: "No",
      size: 60,
      enableSorting: false,
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;

        const visibleIndex = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);

        return pageIndex * pageSize + visibleIndex + 1;
      },
    },
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
      enableSorting: false,
      header: ({ column }) => (
        <BaseTableHeader
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("jenis")}
        </BaseTableHeader>
      ),
      cell: ({ row }) =>
        row.original.jenis?.charAt(0).toUpperCase() +
        row.original.jenis?.slice(1).toLowerCase(),
    },
    {
      accessorKey: "lokasi",
      accessorFn: (row) => row.lokasi,
      enableSorting: false,
      header: ({ column }) => (
        <BaseTableHeader
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("location")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.lokasi,
    },
    {
      accessorKey: "pembina",
      enableSorting: false,
      accessorFn: (row) => row.pembina.namaGuru,
      header: ({ column }) => (
        <BaseTableHeader
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("advisor")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original?.pembina?.namaGuru || "-",
    },
  ];

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
          onEdit={isAdmin ? () => onEdit?.(row.original) : undefined}
          onDelete={isAdmin ? () => onDelete?.(row.original) : undefined}
        />
      );
    },
  });

  return columns;
};

export const ekstrakurikulerDataFallback: any[] = [];

export const memberEkstrakurikulerColumns = ({
  onRemove,
}: any & {}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: "No",
      size: 60,
      enableSorting: false,
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;

        const visibleIndex = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);

        return pageIndex * pageSize + visibleIndex + 1;
      },
    },
    {
      accessorKey: "nama",
      accessorFn: (row) => row.biodataSiswa.user.name,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("name")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.biodataSiswa.user.name,
    },
    {
      accessorKey: "kelas",
      accessorFn: (row) => row.biodataSiswa.kelas.namaKelas,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("classroom")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.biodataSiswa?.kelas?.namaKelas || "-",
    },

    {
      accessorKey: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("status")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original?.status || "-",
    },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      size: 50,
      enableSorting: false,
      header: () => lang.text("action"),
      cell: ({ row }) => {
        return <BaseActionTable onRemove={() => onRemove?.(row.original)} />;
      },
    },
  ];

  return columns;
};

export const absensiEkstrakurikulerColumns =
  ({ }: any & {}): ColumnDef<any>[] => {
    const columns: ColumnDef<any>[] = [
      {
        id: "no",
        header: "No",
        size: 60,
        enableSorting: false,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;

          return pageIndex * pageSize + row.index + 1;
        },
      },
      {
        accessorKey: "nama",
        accessorFn: (row) => row.anggotaEkskul.biodataSiswa.user.name,
        header: ({ column }) => (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("name")}
          </BaseTableHeader>
        ),
        cell: ({ row }) =>
          row.original.anggotaEkskul?.biodataSiswa?.user?.name || "-",
      },
      // {
      //   accessorKey: "kelas",
      //   accessorFn: (row) => row.biodataSiswa.kelas.namaKelas,
      //   header: ({ column }) => (
      //     <BaseTableHeader
      //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //     >
      //       {lang.text("classroom")}
      //     </BaseTableHeader>
      //   ),
      //   cell: ({ row }) => row.original.biodataSiswa?.kelas?.namaKelas || "-",
      // },

      {
        accessorKey: "statusKehadiran",
        accessorFn: (row) => row.statusKehadiran,
        header: ({ column }) => (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("status")}
          </BaseTableHeader>
        ),
        cell: ({ row }) => row.original?.statusKehadiran || "-",
      },
      {
        accessorKey: "jamMulai",
        accessorFn: (row) => row.jamMulai,
        header: ({ column }) => (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("startHour")}
          </BaseTableHeader>
        ),
        cell: ({ row }) => row.original?.jamMulai || "-",
      },
      {
        accessorKey: "jamSelesai",
        accessorFn: (row) => row.jamSelesai,
        header: ({ column }) => (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("startHour")}
          </BaseTableHeader>
        ),
        cell: ({ row }) => row.original?.jamSelesai || "-",
      },
      // {
      //   accessorKey: "id",
      //   accessorFn: (row) => row.id,
      //   size: 50,
      //   enableSorting: false,
      //   header: () => lang.text("action"),
      //   cell: ({ row }) => {
      //     // return <BaseActionTable onRemove={() => onRemove?.(row.original)} />;
      //   },
      // },
    ];
    return columns;
  };

export const rekapBulananColumns = ({ }: any & {}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nama",
      accessorFn: (row) => row.anggotaEkskul.biodataSiswa.user.name,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("name")}
        </BaseTableHeader>
      ),
      cell: ({ row }) =>
        row.original.anggotaEkskul?.biodataSiswa?.user?.name || "-",
    },
    // {
    //   accessorKey: "kelas",
    //   accessorFn: (row) => row.biodataSiswa.kelas.namaKelas,
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       {lang.text("classroom")}
    //     </BaseTableHeader>
    //   ),
    //   cell: ({ row }) => row.original.biodataSiswa?.kelas?.namaKelas || "-",
    // },

    {
      accessorKey: "statusKehadiran",
      accessorFn: (row) => row.statusKehadiran,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("status")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.anggotaEkskul?.status || "-",
    },
    // {
    //   accessorKey: "jamMulai",
    //   accessorFn: (row) => row.original.anggotaEkskul?.biodataSiswa?.user?.nisn || "-",
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       {lang.text("startHour")}
    //     </BaseTableHeader>
    //   ),
    //   cell: ({ row }) => row.original?.original.anggotaEkskul?.biodataSiswa?.user?.name  || "-",
    // },

    // {
    //   accessorKey: "id",
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => lang.text("action"),
    //   cell: ({ row }) => {
    //     // return <BaseActionTable onRemove={() => onRemove?.(row.original)} />;
    //   },
    // },
  ];
  return columns;
};
