import { BaseDataTable } from "@/features/_global";
import { columns } from "../utils/matpel-harian-column";

interface StudentAttendanceTableProps {
  data: any[];
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
}
export function MatpelAttendanceTable({
  data,
  pagination,
  onPaginationChange,
  rowCount,
}: StudentAttendanceTableProps) {
  return (
    <BaseDataTable
      columns={columns}
      data={data}
      dataFallback={[]}
      globalSearch={false}
      searchParamPagination
      showFilterButton={false}
      manualPagination
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={rowCount}
    />
  );
}
