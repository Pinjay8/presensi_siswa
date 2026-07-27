import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BiodataSiswa } from "@/core/models/biodata";
import { BaseDataTable } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import { useMemo } from "react";
import { studentAttendanceColumn } from "../utils";

interface StudentAttendanceTableProps {
  data: BiodataSiswa[];
  isLoading?: boolean;
  totalAttedance?: boolean;
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
  global: any;
  setGlobal: any;
  sorting: any;
  onSortingChange: any;
  filter?: any;
  setFilter: any
}

export function StudentAttendanceTable({
  data,
  totalAttedance,
  isLoading,
  pagination,
  onPaginationChange,
  rowCount,
  global,
  setGlobal,
  sorting,
  onSortingChange,
  filter,
  setFilter,

}: StudentAttendanceTableProps) {
  const classroom = useClassroom();

  const columns = useMemo(
    () =>
      studentAttendanceColumn({
        classroomOptions: distinctObjectsByProperty(
          classroom.data?.map((d) => ({
            label: d.namaKelas,
            value: d.namaKelas,
          })) || [],
          "value",
        ),

      }),
    [classroom.data],
  );

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={columns}
        globalSearch
        searchParamPagination
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={rowCount}
        showFilterButton
        globalFilter={global}
        onGlobalFilterChange={setGlobal}
        sorting={sorting}
        onSortingChange={onSortingChange}
        onFilterChange={setFilter}
        filters={[
          {
            id: "kelasId",
            label: lang.text("classroom"),
            variant: "select",
            options: classroom.data?.map((d) => ({
              label: d.namaKelas,
              value: d.id,
            })),
          },
          {
            id: "statusKehadiran",
            label: lang.text("attendanceStatus"),
            variant: "select",
            options: [
              {
                label: lang.text("present"),
                value: "hadir",
              },
              {
                label: lang.text("late"),
                value: "terlambat",
              },
              {
                label: lang.text("alfa"),
                value: "alfa",
              },
              {
                label: lang.text("sick"),
                value: "sakit",
              },
              {
                label: lang.text("permit"),
                value: "izin",
              },
            ],
          },
        ]}
        searchPlaceholder={lang.text("search") + " " + lang.text("student")}
        isLoading={isLoading}
      />
    </div>
  );
}
