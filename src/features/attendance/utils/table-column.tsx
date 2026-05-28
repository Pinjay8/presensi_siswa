import { Badge, dayjs, lang, simpleEncode } from '@/core/libs';
import { BiodataSiswa } from '@/core/models/biodata';
import { getStaticFile } from '@/core/utils';
import {
  BaseActionTable,
  BaseDataTableFilterValueItem,
  BaseTableFilter,
  BaseTableHeader,
  BaseUserItem,
} from '@/features/_global';
import { ColumnDef } from '@tanstack/react-table';
import { EvidenceItem, EvidencePreview } from '../components';
import { BiodataGuru } from '@/core/models/biodata-guru';

export const studentAttendanceColumn = ({
  schoolOptions = [],
  classroomOptions = [],
}: BaseTableFilter): ColumnDef<BiodataSiswa>[] => {
  return [
    {
      accessorKey: 'attendance.createdAt',
      accessorFn: (row) => row.attendance?.createdAt,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('date')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.createdAt
              ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamMasuk',
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockIn')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamMasuk
              ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamPulang',
      accessorFn: (row) => row.attendance?.jamPulang,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockOut')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const jamPulang = row.original.attendance?.jamPulang;
        return (
          <div>
            {jamPulang && dayjs(jamPulang).isValid()
              ? dayjs(jamPulang).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'user.name',
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('student')}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.user?.image}
            name={row.original.user?.name}
            text1={`${row.original.kelas?.namaKelas || '-'} / ${
              row.original.user?.sekolah?.namaSekolah || '-'
            }`}
            text2={`NIS: ${row.original.user?.nis || '-'} / NISN: ${
              row.original.user?.nisn || '-'
            }`}
          />
        );
      },
    },
    {
      accessorKey: 'user.email',
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NIS'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nis',
      accessorFn: (row) => row.user?.nis,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NIS'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nisn',
      accessorFn: (row) => row.user?.nisn,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NISN`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.sekolah.namaSekolah',
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      ...(schoolOptions &&
        schoolOptions.length > 0 && {
          meta: {
            filterLabel: lang.text('school'),
            filterPlaceholder: lang.text('selectSchool'),
            filterVariant: 'select',
            filterOptions: schoolOptions,
            filterColumnVisible: false,
          },
        }),
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('schoolName')}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'kelas.namaKelas',
      accessorFn: (row) => row.kelas?.namaKelas,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('classroom')}
          </BaseTableHeader>
        );
      },
      ...(classroomOptions &&
        classroomOptions.length > 0 && {
          meta: {
            filterLabel: lang.text('classroom'),
            filterPlaceholder: lang.text('selectClassroom'),
            filterVariant: 'select',
            filterOptions: classroomOptions,
            filterColumnVisible: false,
          },
        }),
      cell: ({ row }) => <span>{row.original.kelas?.namaKelas || '-'}</span>,
    },
    {
      accessorKey: 'attendance.statusKehadiran',
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('status')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.attendance?.statusKehadiran ? (
            <Badge>
              {row.original.attendance?.statusKehadiran?.toUpperCase()}
            </Badge>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('evidence')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

        if (row.original.attendance?.fotoAbsen) {
          items.push({
            title: lang.text('attendanceInPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsen),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.fotoAbsenPulang) {
          items.push({
            title: lang.text('attendanceOutPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsenPulang),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text('evidence'),
            image: getStaticFile(
              row.original.attendance?.dispensasi?.buktiSurat,
            ),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
    // {
    //   accessorKey: 'id',
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => {
    //     return null;
    //   },
    //   cell: ({ row }) => {
    //     const encryptPayload = simpleEncode(
    //       JSON.stringify({
    //         id: row.original.id,
    //         text: row.original.user?.name,
    //       }),
    //     );
    //     return (
    //       <BaseActionTable
    //         detailPath={`/students/${encryptPayload}`}
    //         editPath={`/students/edit/${encryptPayload}`}
    //         // deletePath={`/students/delete/${encryptPayload}`}
    //       />
    //     );
    //   },
    // },
  ];
};

export const teacherAttendanceColumn = ({
  schoolOptions = [],
}: {
  schoolOptions: BaseDataTableFilterValueItem[];
}): ColumnDef<BiodataGuru>[] => {
  return [
    {
      accessorKey: 'attendance.createdAt',
      accessorFn: (row) => row.attendance?.createdAt,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('date')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.createdAt
              ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamMasuk',
      accessorFn: (row) => row.attendance?.jamMasuk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockIn')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamMasuk
              ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance.jamPulang',
      accessorFn: (row) => row.attendance?.jamPulang,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('clockOut')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.attendance?.jamPulang
              ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
              : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'user.name',
      accessorFn: (row) => row.user?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('teacher')}
          </BaseTableHeader>
        );
      },
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <BaseUserItem
            image={row.original.user?.image}
            name={row.original.user?.name}
            text1={`NIP: ${row.original.user?.nip || '-'} / ${
              row.original.user?.sekolah?.namaSekolah || '-'
            }`}
            text2={`NRK: ${row.original.user?.nrk || '-'} / NIKKI: ${
              row.original.user?.nikki || '-'
            }`}
          />
        );
      },
    },
    {
      accessorKey: 'user.email',
      accessorFn: (row) => row.user?.email,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NIS'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nrk',
      accessorFn: (row) => row.user?.nrk,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {'NRK'}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nip',
      accessorFn: (row) => row.user?.nip,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIP`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.nikki',
      accessorFn: (row) => row.user?.nikki,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {`NIKKI`}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'user.sekolah.namaSekolah',
      accessorFn: (row) => row.user?.sekolah?.namaSekolah,
      meta: {
        filterLabel: lang.text('school'),
        filterPlaceholder: lang.text('selectSchool'),
        filterVariant: 'select',
        filterOptions: schoolOptions,
        filterColumnVisible: false,
      },
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('schoolName')}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: 'attendance.statusKehadiran',
      accessorFn: (row) => row.attendance?.statusKehadiran,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('status')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.attendance?.statusKehadiran ? (
            <Badge>
              {row.original.attendance?.statusKehadiran?.toUpperCase()}
            </Badge>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      accessorKey: 'user.id',
      accessorFn: (row) => row.user?.id,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {lang.text('evidence')}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        const items: EvidenceItem[] = [];

        if (row.original.attendance?.fotoAbsen) {
          items.push({
            title: lang.text('attendanceInPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsen),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.fotoAbsenPulang) {
          items.push({
            title: lang.text('attendanceOutPhoto'),
            image: getStaticFile(row.original.attendance?.fotoAbsenPulang),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        if (row.original.attendance?.dispensasi?.buktiSurat) {
          items.push({
            title: lang.text('evidence'),
            image: getStaticFile(
              row.original.attendance?.dispensasi?.buktiSurat,
            ),
            status: row.original.attendance?.statusKehadiran,
          });
        }

        return <EvidencePreview items={items} />;
      },
    },
    // {
    //   accessorKey: 'id',
    //   accessorFn: (row) => row.id,
    //   size: 50,
    //   enableSorting: false,
    //   header: () => {
    //     return null;
    //   },
    //   cell: ({ row }) => {
    //     const encryptPayload = simpleEncode(
    //       JSON.stringify({
    //         id: row.original.userId,
    //         text: row.original.user?.name,
    //       }),
    //     );
    //     return (
    //       <BaseActionTable
    //         detailPath={`/teachers/${encryptPayload}`}
    //         editPath={`/teachers/edit/${encryptPayload}`}
    //         // deletePath={`/students/delete/${encryptPayload}`}
    //       />
    //     );
    //   },
    // },
  ];
};

// Kolom untuk riwayat absensi
export const historyAttendanceColumn = (): ColumnDef<BiodataSiswa>[] => [
  {
    accessorKey: 'attendance.createdAt',
    accessorFn: (row) => row.attendance?.createdAt,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('date')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.createdAt
            ? dayjs(row.original.attendance?.createdAt).format('DD MMM YYYY')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'user.name',
    accessorFn: (row) => row.user?.name,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('student')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return <BaseUserItem name={row.original.user?.name} />;
    },
  },
  {
    accessorKey: 'attendance.jamMasuk',
    accessorFn: (row) => row.attendance?.jamMasuk,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockIn')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamMasuk
            ? dayjs(row.original.attendance?.jamMasuk).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.jamPulang',
    accessorFn: (row) => row.attendance?.jamPulang,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('clockOut')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.attendance?.jamPulang
            ? dayjs(row.original.attendance?.jamPulang).format('HH:mm')
            : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance.statusKehadiran',
    accessorFn: (row) => row.attendance?.statusKehadiran,
    header: ({ column }) => {
      return (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {lang.text('status')}
        </BaseTableHeader>
      );
    },
    cell: ({ row }) => (
      <>
        {row.original.attendance?.statusKehadiran ? (
          <Badge>
            {row.original.attendance?.statusKehadiran?.toUpperCase()}
          </Badge>
        ) : (
          '-'
        )}
      </>
    ),
  },
];
