import { BiodataGuru } from "@/core/models/biodata-guru";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  dayjs,
} from "@/core/libs";
import { ColumnDef } from "@tanstack/react-table";
import { TableItemGuru } from "../components";
import {
  BaseActionTable,
  BaseDataTableFilterValueItem,
  BaseTableHeader,
  BaseUserItem,
} from "@/features/_global";
import { lang, simpleEncode } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  EvidenceItem,
  EvidencePreview,
} from "@/features/attendance/components";

export const tableColumnGuru: ColumnDef<BiodataGuru>[] = [
  {
    accessorKey: "namaGuru",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Data Guru"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <BaseUserItem
          image={getStaticFile(String(row.original.user?.image))}
          name={row.original.user?.name}
          text2={dayjs(row.original.attendance?.createdAt).fromNow()}
        />
      );
    },
    accessorFn: (row) => row.namaGuru,
    enableGlobalFilter: true,
  },
  {
    accessorFn: (row) => row.user?.email,
    accessorKey: "user.email",
  },
  {
    accessorFn: (row) => row.user?.nip,
    accessorKey: "user.nip",
  },
  {
    accessorFn: (row) => row.user?.nrk,
    accessorKey: "user.nrk",
  },
  {
    accessorFn: (row) => row.user?.sekolah?.namaSekolah,
    accessorKey: "user.sekolah.namaSekolah",
  },
  {
    accessorFn: (row) => row.user?.nik,
    accessorKey: "user.nik",
  },
  {
    accessorFn: (row) => row.mataPelajaran?.namaMataPelajaran,
    accessorKey: "mataPelajaran.namaMataPelajaran",
  },
  {
    accessorFn: (row) => row.kode_guru,
    accessorKey: "kode_guru",
  },
  {
    accessorKey: "attendance.createdAt",
    accessorFn: (row) => row.attendance?.createdAt,
  },
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
          text: row.original.user?.name,
        }),
      );
      return (
        <div className="flex flex-row justify-end">
          <BaseActionTable
            detailPath={`/teachers/${encryptPayload}`}
            editPath={`/teachers/edit/${encryptPayload}`}
          // waliKelasPath={`/teachers/wali-kelas/${encryptPayload}`}
          // deletePath={`/students/delete/${encryptPayload}`}
          />
        </div>
      );
    },
  },
];

export const teacherColumnWithFilter = ({
  schoolOptions = [],
  onWaliKelas,
  onAssignSchedule,
  onDelete,
  onRegisterFace,
}: {
  schoolOptions?: BaseDataTableFilterValueItem[];
  onWaliKelas?: (teacher: any) => void;
  onAssignSchedule?: (teacher: any) => void;
  onDelete?: (teacher: any) => void;
  onRegisterFace?: (teacher: any) => void;
}): ColumnDef<any>[] => {
  return [
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
      accessorKey: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("teacherName")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        const nameArr = row.original.name?.split(" ") || [];
        const initialName =
          nameArr && nameArr.length > 0
            ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
            : "-";
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                className="h-full w-full object-cover"
                src={
                  row.original?.fotoTampakDepan ||
                  (row.original?.user?.image
                    ? getStaticFile(String(row.original.user.image))
                    : "")
                }
                alt={row.original?.name}
              />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
            <p>{row.original.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      accessorFn: (row) => row.email,
      enableSorting: false,
      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("email")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "nip",
      accessorFn: (row) => row.nip,
      enableSorting: false,
      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIP"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "nrk",
      accessorFn: (row) => row.nrk,
      enableSorting: false,
      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NRK`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "nikki",
      accessorFn: (row) => row.nikki,
      enableSorting: false,
      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NIKKI`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "sekolah.namaSekolah",
      accessorFn: (row) => row.sekolah?.namaSekolah,
      // meta: {
      //   filterLabel: lang.text("school"),
      //   filterPlaceholder: lang.text("selectSchool"),
      //   filterVariant: "select",
      //   filterOptions: schoolOptions,
      // },
      enableSorting: false,

      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
          </BaseTableHeader>
        );
      },
    },

    {
      accessorKey: "Schedule.name",
      accessorFn: (row) => row.attendanceScheduleName,
      enableSorting: false,
      header: ({ column }) => {
        return (
          <BaseTableHeader
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("scheduler")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {row.original.attendanceScheduleName || "-"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "waliKelas",
      header: () => (
        <BaseTableHeader>
          Wali Kelas
        </BaseTableHeader>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const waliKelas = row.original.waliKelas ?? [];

        return (
          <div className="flex flex-wrap gap-1">
            {waliKelas.length > 0 ? (
              waliKelas.map((item: any) => (
                <Badge key={item.kelasId} variant="secondary">
                  {item.namaKelas}
                </Badge>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
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
            text: row.original.name,
          }),
        );
        return (
          <BaseActionTable
            detailPath={`/teachers/${encryptPayload}`}
            editPath={`/teachers/edit/${encryptPayload}`}
            onWaliKelas={() => onWaliKelas?.(row.original)}
            onAssignSchedule={() => onAssignSchedule?.(row.original)}
            onDelete={() => onDelete?.(row.original)}
            onRegisterFace={() => onRegisterFace?.(row.original)}
          />
        );
      },
    },
  ];
};

export const tableDataGuruFallback: BiodataGuru[] = [];

export const teacherDailyPresenceColumn: ColumnDef<
  BiodataGuru["absensis"][0]
>[] = [
    {
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("date")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.createdAt
              ? dayjs(row.original.createdAt).format("DD MMM YYYY")
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "jamMasuk",
      accessorFn: (row) => row.jamMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("clockIn")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.jamMasuk
              ? dayjs(row.original.jamMasuk).format("HH:mm")
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "jamPulang",
      accessorFn: (row) => row.jamPulang,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("clockOut")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.jamPulang
              ? dayjs(row.original.jamPulang).format("HH:mm")
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "tipeAbsenMasuk",
      accessorFn: (row) => row.tipeAbsenMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("presenceType")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "statusKehadiran",
      accessorFn: (row) => row.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("presenceStatus")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original?.statusKehadiran ? (
            <Badge>{row.original?.statusKehadiran?.toUpperCase()}</Badge>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      accessorKey: "id",
      accessorFn: (row) => row.id,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("evidence")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

        if (row.original?.fotoAbsen) {
          items.push({
            title: lang.text("attendanceInPhoto"),
            image: getStaticFile(row.original?.fotoAbsen),
            status: row.original?.statusKehadiran,
          });
        }

        if (row.original?.fotoAbsenPulang) {
          items.push({
            title: lang.text("attendanceOutPhoto"),
            image: getStaticFile(row.original?.fotoAbsenPulang),
            status: row.original?.statusKehadiran,
          });
        }

        if (row.original?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text("evidence"),
            image: getStaticFile(row.original?.dispensasi?.buktiSurat),
            status: row.original?.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
  ];
