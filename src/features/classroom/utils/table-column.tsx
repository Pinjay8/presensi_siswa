import { lang, simpleEncode } from "@/core/libs";
import { ClassroomDataModel } from "@/core/models";
import {
  BaseActionTable,
  BaseTableFilter,
  BaseTableHeader,
} from "@/features/_global";
import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export interface classroomColumnsProps {
  columnFilter?: BaseTableFilter | undefined;
  onAssignSchedule?: (row: ClassroomDataModel) => void;
  onDelete?: (row: ClassroomDataModel) => void;
  isAdmin?: any;
}

export const classroomColumns = ({
  columnFilter,
  onAssignSchedule,
  onDelete,
  isAdmin,
}: classroomColumnsProps = {}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "namaKelas",
      accessorFn: (row) => row.namaKelas,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("classRoom")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.namaKelas,
    },
    {
      accessorKey: "level",
      accessorFn: (row) => row.level,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
        </BaseTableHeader>
      ),
    },
    // {
    //   accessorKey: "Sekolah.namaSekolah",
    //   accessorFn: (row) => row.Sekolah?.namaSekolah,
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Sekolah
    //     </BaseTableHeader>
    //   ),
    //   meta: {
    //     filterLabel: lang.text("school"),
    //     filterPlaceholder: lang.text("selectSchool"),
    //     filterVariant: "select",
    //     filterOptions: columnFilter?.schoolOptions || [],
    //   },
    // },
    {
      accessorKey: "Schedule.name",
      accessorFn: (row) => row.attendanceSchedule?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("scheduler")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="text-sm ">
              {row.original.attendanceSchedule?.name || "-"}
            </div>
          </div>
        );
      },
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
            text: row.original.namaKelas,
          }),
        );

        return (
          <BaseActionTable
            detailPath={`/classrooms/${encryptPayload}`}
            editPath={`/classrooms/edit/${encryptPayload}`}
            onAssignSchedule={() => onAssignSchedule?.(row.original)}
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    });
  }

  return columns;
};

export const classroomDataFallback: ClassroomDataModel[] = [];

export const classroomScheduleColumns = ({
  columnFilter,
  onAssignSchedule,
  onDelete,
  isAdmin,
}: classroomColumnsProps = {}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "namaKelas",
      accessorFn: (row) => row.namaKelas,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {lang.text("classRoom")}
        </BaseTableHeader>
      ),
      cell: ({ row }) => row.original.namaKelas,
    },
    {
      accessorKey: "level",
      accessorFn: (row) => row.level,
      header: ({ column }) => (
        <BaseTableHeader
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
        </BaseTableHeader>
      ),
    },
    // {
    //   accessorKey: "Sekolah.namaSekolah",
    //   accessorFn: (row) => row.Sekolah?.namaSekolah,
    //   header: ({ column }) => (
    //     <BaseTableHeader
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Sekolah
    //     </BaseTableHeader>
    //   ),
    //   meta: {
    //     filterLabel: lang.text("school"),
    //     filterPlaceholder: lang.text("selectSchool"),
    //     filterVariant: "select",
    //     filterOptions: columnFilter?.schoolOptions || [],
    //   },
    // },
    {
      accessorKey: "Schedule.name",
      accessorFn: (row) => row.attendanceSchedule?.name,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("scheduler")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="text-sm ">
              {row.original.attendanceSchedule?.name || "-"}
            </div>
          </div>
        );
      },
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
            text: row.original.namaKelas,
          }),
        );

        return <BaseActionTable detailPath={`/schedules/${encryptPayload}`} />;
      },
    });
  }

  return columns;
};
