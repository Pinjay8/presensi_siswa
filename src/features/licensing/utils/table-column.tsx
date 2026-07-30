import { lang, simpleEncode } from "@/core/libs";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { useProfile } from "@/features/profile";
import { ColumnDef } from "@tanstack/react-table";

type LicensingColumnsProps = {
  columFilter?: any;
  onEdit?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  isRoleTeacher?: boolean;
};

export const licensingColumns = ({
  columFilter,
  onEdit,
  onApprove,
  onReject,
  isRoleTeacher,
}: LicensingColumnsProps): any[] => {
  return [
    {
      id: "no",
      header: "No",
      size: 60,
      enableSorting: false,
      cell: ({ row, table }: any) => {
        // const { pageIndex, pageSize } = table.getState().pagination;

        // return pageIndex * pageSize + row.index + 1;
        const { pageIndex, pageSize } = table.getState().pagination;

        const visibleIndex = table
          .getRowModel()
          .rows.findIndex((r: any) => r.id === row.id);

        return pageIndex * pageSize + visibleIndex + 1;
      },
    },
    {
      accessorKey: "alasan",
      accessorFn: (row: any) => row.alasan,
      enableSorting: false,
      header: ({ column }: any) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("reason")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }: any) => {
        return <span className="capitalize">{row.original.alasan}</span>;
      },
    },
    {
      accessorKey: "BiodataSiswa.user.name",
      accessorFn: (row: any) => row.BiodataSiswa.user.name,
      enableSorting: false,

      header: ({ column }: any) => {
        return (
          <BaseTableHeader
          >
            {lang.text("name")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }: any) => {
        return <span>{row.original.BiodataSiswa.user?.name || "-"}</span>;
      },
    },
    {
      accessorKey: "statusPengajuan",
      accessorFn: (row: any) => row.statusPengajuan,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("statusLicensing")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => {
        const status = row.original.statusPengajuan?.toLowerCase();

        const statusMap = {
          pending: {
            label: lang.text("pending"),
            className:
              "bg-amber-100 text-amber-700 border border-amber-200",
          },
          disetujui: {
            label: lang.text("approved"),
            className:
              "bg-green-100 text-green-700 border border-green-200",
          },
          ditolak: {
            label: lang.text("rejected"),
            className:
              "bg-red-100 text-red-700 border border-red-200",
          },
        } as const;

        const config = statusMap[status as keyof typeof statusMap];

        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config?.className ??
              "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
          >
            {config?.label ?? row.original.statusPengajuan}
          </span>
        );
      },
    },
    {
      accessorKey: "tanggalMulai",
      accessorFn: (row: any) => row.tanggalMulai,
      enableSorting: false,
      header: ({ column }: any) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("startDate")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }: any) => {
        return <span>{row.original.tanggalMulai}</span>;
      },
    },
    {
      accessorKey: "tanggalSelesai",
      accessorFn: (row: any) => row.tanggalSelesai,
      enableSorting: false,
      header: ({ column }: any) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("endDate")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }: any) => {
        return <span>{row.original.tanggalSelesai}</span>;
      },
    },

    // {
    //   accessorKey: "id",
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => {
    //     return null;
    //   },
    //   cell: ({ row }) => {
    //     // const encryptPayload = simpleEncode(
    //     //   JSON.stringify({
    //     //     id: row.original.id,
    //     //     text: row.original.nomorKartu,
    //     //   }),
    //     // );
    //     // // console.log(encryptPayload)
    //     // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
    //     return (
    //       <BaseActionTable
    //         onApprove={() => onApprove?.(row.original.id)}
    //         onReject={() => onReject?.(row.original.id)}
    //       />
    //     );
    //   },
    // },
    ...(isRoleTeacher
      ? [
        {
          accessorKey: "id",
          accessorFn: (row: any) => row.id,
          size: 50,
          enableSorting: false,
          header: ({ column }: any) => {
            return (
              <BaseTableHeader
              // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {lang.text("action")}
              </BaseTableHeader>
            );
          },
          cell: ({ row }: any) => (
            <BaseActionTable
              onApprove={() => onApprove?.(row.original.id)}
              onReject={() => onReject?.(row.original.id)}
            />
          ),
        },
      ]
      : []),
  ];
};

export const cardSFallback: any[] = [];
