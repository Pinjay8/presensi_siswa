import { Badge, dayjs, lang, simpleEncode } from "@/core/libs";
import { BiodataSiswa } from "@/core/models/biodata";
import { getStaticFile } from "@/core/utils";
import {
  BaseActionTable,
  BaseDataTableFilterValueItem,
  BaseTableFilter,
  BaseTableHeader,
  BaseUserItem,
} from "@/features/_global";
import { ColumnDef } from "@tanstack/react-table";
import { EvidenceItem, EvidencePreview } from "../components";
import { BiodataGuru } from "@/core/models/biodata-guru";

export const studentAttendanceColumn = ({
  schoolOptions = [],
  classroomOptions = [],
}: BaseTableFilter): ColumnDef<any>[] => {
  return [
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
        const jamPulang = row.original.jamPulang;
        return (
          <div>
            {jamPulang && dayjs(jamPulang).isValid()
              ? dayjs(jamPulang).format("HH:mm")
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "user.name",
      accessorFn: (row) => row.siswa?.name,

      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("student")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.siswa?.image}
            name={row.original.siswa?.nama}
            text1={`${row.original.siswa.kelas || "-"} / ${
              row.original.siswa.sekolah || "-"
            }`}
            text2={`NIS: ${row.original.siswa?.nis || "-"} / NISN: ${
              row.original.siswa?.nisn || "-"
            }`}
          />
        );
      },
    },
    {
      accessorKey: "user.email",
      accessorFn: (row) => row.siswa?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIS"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nis",
      accessorFn: (row) => row.siswa?.nis,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIS"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nisn",
      accessorFn: (row) => row.siswa.nisn,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NISN`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.sekolah.namaSekolah",
      accessorFn: (row) => row.siswa.sekolah,
      ...(schoolOptions &&
        schoolOptions.length > 0 && {
          meta: {
            filterLabel: lang.text("school"),
            filterPlaceholder: lang.text("selectSchool"),
            filterVariant: "select",
            filterOptions: schoolOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "kelas.namaKelas",
      accessorFn: (row) => row.siswa.kelas,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("classroom")}
          </BaseTableHeader>
        );
      },
      ...(classroomOptions &&
        classroomOptions.length > 0 && {
          meta: {
            filterLabel: lang.text("classroom"),
            filterPlaceholder: lang.text("selectClassroom"),
            filterVariant: "select",
            filterOptions: classroomOptions,
            filterColumnVisible: false,
          },
        }),
      cell: ({ row }) => <span>{row.original.siswa.kelas || "-"}</span>,
    },
    {
      accessorKey: "statusKehadiran",
      accessorFn: (row) => row.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("status")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.statusKehadiran ? (
            <Badge className="capitalize">{row.original.statusKehadiran}</Badge>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      accessorKey: "user.id",
      accessorFn: (row) => row.user?.id,
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

        if (row.original.fotoAbsen) {
          items.push({
            title: lang.text("attendanceInPhoto"),
            image: getStaticFile(row.original.fotoAbsen),
            status: row.original.statusKehadiran,
          });
        }

        if (row.original.fotoAbsenPulang) {
          items.push({
            title: lang.text("attendanceOutPhoto"),
            image: getStaticFile(row.original.fotoAbsenPulang),
            status: row.original.statusKehadiran,
          });
        }

        if (row.original.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text("evidence"),
            image: getStaticFile(row.original.dispensasi?.buktiSurat),
            status: row.original.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
  ];
};

export const teacherAttendanceColumn = ({
  schoolOptions = [],
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "created_at",
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
      accessorKey: "user.name",
      accessorFn: (row) => row.guru?.namaGuru,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("teacher")}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.guru?.image}
            name={row.original.guru?.namaGuru}
            text1={`NIP: ${row.original.guru?.nip || "-"} 
            `}
            text2={`NRK: ${row.original.guru?.nrk || "-"} / NIKKI: ${
              row.original.guru?.nikki || "-"
            }`}
          />
        );
      },
    },
    {
      accessorKey: "user.email",
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NIS"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nrk",
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"NRK"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nip",
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NIP`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.nikki",
      accessorFn: (row) => row.user?.nikki,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`NIKKI`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "user.sekolah.namaSekolah",
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: schoolOptions,
        filterColumnVisible: false,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("schoolName")}
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
            {lang.text("status")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.statusKehadiran ? (
            <Badge>{row.original.statusKehadiran?.toUpperCase()}</Badge>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      accessorKey: "user.id",
      accessorFn: (row) => row.user?.id,
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

        if (row.original.fotoAbsen) {
          items.push({
            title: lang.text("attendanceInPhoto"),
            image: getStaticFile(row.original.fotoAbsen),
            status: row.original.statusKehadiran,
          });
        }

        if (row.original.fotoAbsenPulang) {
          items.push({
            title: lang.text("attendanceOutPhoto"),
            image: getStaticFile(row.original.fotoAbsenPulang),
            status: row.original.statusKehadiran,
          });
        }

        if (row.original.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text("evidence"),
            image: getStaticFile(row.original.dispensasi?.buktiSurat),
            status: row.original.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
  ];
};

// Kolom untuk riwayat absensi
export const historyAttendanceColumn = (): ColumnDef<any>[] => [
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
    accessorKey: "user.name",
    accessorFn: (row) => row.siswa?.name,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("student")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return <BaseUserItem name={row.original.siswa?.nama} />;
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
    accessorKey: "statusKehadiran",
    accessorFn: (row) => row.statusKehadiran,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("status")}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => (
      <>
        {row.original.statusKehadiran ? (
          <Badge>{row.original.statusKehadiran?.toUpperCase()}</Badge>
        ) : (
          "-"
        )}
      </>
    ),
  },
];
