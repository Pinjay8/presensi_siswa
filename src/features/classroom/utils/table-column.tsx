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
  columnFilter?: BaseTableFilter;
  onAssignSchedule?: (row: ClassroomDataModel) => void;
  onDelete?: (row: ClassroomDataModel) => void;
}

export const classroomColumns = ({
  columnFilter,
  onAssignSchedule,
  onDelete,
}: classroomColumnsProps): ColumnDef<ClassroomDataModel>[] => {
  return [
    {
      accessorKey: "namaKelas",
      accessorFn: (row) => row.namaKelas,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {lang.text("classRoom")}
          </BaseTableHeader>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.namaKelas}</span>;
      },
    },
    {
      accessorKey: "level",
      accessorFn: (row) => row.level,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Level"}
          </BaseTableHeader>
        );
      },
    },
    {
      accessorKey: "Sekolah.namaSekolah",
      accessorFn: (row) => row.Sekolah?.namaSekolah,
      header: ({ column }) => {
        return (
          <BaseTableHeader
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Sekolah"}
          </BaseTableHeader>
        );
      },
      meta: {
        filterLabel: lang.text("school"),
        filterPlaceholder: lang.text("selectSchool"),
        filterVariant: "select",
        filterOptions: columnFilter?.schoolOptions || [],
      },
    },
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
            <div className="text-sm font-medium">{row.original.attendanceSchedule?.name || "- - -"}</div>
          </div>
        );
      },
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
          JSON.stringify({ id: row.original.id, text: row.original.namaKelas }),
        );
        // // console.log(encryptPayload)
        // const encryptPayload = JSON.stringify({ id: row.original.id, text: row.original.namaKelas })
        return (
          <BaseActionTable
            detailPath={`/classrooms/${encryptPayload}`}
            editPath={`/classrooms/edit/${encryptPayload}`}
            // deletePath={`/classrooms/delete/${encryptPayload}`}
            onAssignSchedule={() => onAssignSchedule?.(row.original)}
            onDelete={() => onDelete?.(row.original)}
          />
        );
      },
    },
  ];
};

export const classroomDataFallback: ClassroomDataModel[] = [];
