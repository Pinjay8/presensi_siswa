import { lang } from "@/core/libs";
import {
  BaseDataTable,
  useAlert,
  useDataTableController,
  useVokadialog,
  Vokadialog,
} from "@/features/_global";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  classroomColumns,
  classroomDataFallback,
  classroomScheduleColumns,
  useClassroom,
} from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { useClassroomPaginated } from "@/features/classroom/hooks/use-classroom-paginated";

export function ScheduleLandingContent() {
  const profile = useProfile();

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
  });

  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };

  const {
    data: classroom,
    pagination: paginationInfo,
    isLoading,
    query,
  } = useClassroomPaginated(params);

  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

  const columns = useMemo(
    () =>
      classroomScheduleColumns({
        isAdmin,
      }),
    [classroom],
  );

  return (
    <>
      <BaseDataTable
        columns={columns}
        data={classroom}
        dataFallback={classroomDataFallback}
        globalSearch
        showFilterButton
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={isLoading}
        manualPagination
        rowCount={paginationInfo?.total ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </>
  );
}
