import { useUserAdmin } from "@/features/user";
import { adminUserColumns, adminUserDataFallback } from "@/features/user";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo } from "react";

export function AdminTable() {
  const biodata = useUserAdmin();

  const columns = useMemo(() => adminUserColumns(), []);

  return (
    <BaseDataTable
      columns={columns}
      data={biodata.data}
      dataFallback={adminUserDataFallback}
      globalSearch
      searchParamPagination
      // showFilterButton
      searchPlaceholder={lang.text("search")}
      isLoading={biodata.query.isLoading}
    />
  );
}
