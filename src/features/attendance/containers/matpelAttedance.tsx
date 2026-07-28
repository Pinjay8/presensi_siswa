import { BaseDataTable } from "@/features/_global";
import { columns } from "../utils/matpel-harian-column";
import { lang } from "@/core/libs";

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
  filter?: any;

  isLoading?: boolean;
  classroomOptions?: {
    label: string;
    value: string;
  }[];

  courseOptions?: {
    label: string;
    value: string;
  }[];
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
  filter,

  classroomOptions,
  courseOptions
}: MatpelAttendanceTableProps) {

  const isPeriodSelected = !!filter?.filter;
  return (
    <BaseDataTable
      columns={columns}
      data={data}
      dataFallback={[]}
      globalSearch
      searchParamPagination
      showFilterButton
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
      searchPlaceholder={lang.text("search")}
      filters={[
        {
          id: "kelasId",
          label: lang.text("classroom"),
          variant: "select",
          options: classroomOptions,
        },
        {
          id: "mataPelajaranId",
          label: lang.text("course"),
          variant: "select",
          options: courseOptions,
        },
        {
          id: "filter",
          label: lang.text("period"),
          variant: "select",
          placeholder: lang.text("selectPeriod"),
          options: [
            { label: lang.text("daily"), value: "harian" },
            { label: lang.text("yesterday"), value: "kemarin" },
            { label: lang.text("weeks"), value: "mingguan" },
            { label: lang.text("lastWeek"), value: "minggu_lalu" },
            { label: lang.text("months"), value: "bulanan" },
            { label: lang.text("lastMonth"), value: "bulanan_lalu" },
            { label: lang.text("years"), value: "tahunan" },
            { label: lang.text("lastYear"), value: "tahunan_lalu" },

          ],
        },
        {
          id: "startDate",
          label: lang.text("startDate"),
          variant: "date",
          disabled: isPeriodSelected,
        },
        {
          id: "endDate",
          label: lang.text("endDate"),
          variant: "date",
          disabled: isPeriodSelected,
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
              label: lang.text("permit"),
              value: "izin",
            },
            {
              label: lang.text("sick"),
              value: "sakit",
            },
            {
              label: lang.text("alfa"),
              value: "alfa",
            },
          ],
        },
      ]}
    />
  );
}