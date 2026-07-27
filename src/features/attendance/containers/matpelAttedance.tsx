import { BaseDataTable } from "@/features/_global";
import { columns } from "../utils/matpel-harian-column";

interface MatpelAttendanceTableProps {
  data: any[];
  pagination: any;
  onPaginationChange: any;
  rowCount: number;

  global: string;
  setGlobal: any;

  sorting: any;
  onSortingChange: any;

  setFilter: any;

  isLoading?: boolean;
}

export function MatpelAttendanceTable({
  data,
  pagination,
  onPaginationChange,
  rowCount,

  global,
  setGlobal,

  sorting,
  onSortingChange,

  setFilter,

  isLoading,
}: MatpelAttendanceTableProps) {
  return (
    <BaseDataTable
      columns={columns}
      data={data}
      dataFallback={[]}

      globalSearch
      searchParamPagination
      // showFilterButton

      globalFilter={global}
      onGlobalFilterChange={setGlobal}

      sorting={sorting}
      onSortingChange={onSortingChange}

      pagination={pagination}
      onPaginationChange={onPaginationChange}

      onFilterChange={setFilter}

      manualPagination
      rowCount={rowCount}
      isLoading={isLoading}

    // filters={[
    //   {
    //     id: "kelasId",
    //     label: lang.text("classroom"),
    //     variant: "select",
    //     options: classroomOptions,
    //   },
    //   {
    //     id: "mataPelajaran",
    //     label: lang.text("course"),
    //     variant: "select",
    //     options: courseOptions.map((x) => ({
    //       label: x,
    //       value: x,
    //     })),
    //   },
    //   {
    //     id: "statusKehadiran",
    //     label: lang.text("attendanceStatus"),
    //     variant: "select",
    //     options: [
    //       { label: lang.text("present"), value: "hadir" },
    //       { label: lang.text("late"), value: "terlambat" },
    //       { label: lang.text("permission"), value: "izin" },
    //       { label: lang.text("sick"), value: "sakit" },
    //       { label: lang.text("absent"), value: "alfa" },
    //     ],
    //   },
    // ]}
    />
  );
}