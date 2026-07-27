import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BiodataSiswa } from "@/core/models/biodata";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";

import { matpelColumns } from "../utils";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { DialogTitle } from "@radix-ui/react-dialog";
import { attendanceService } from "@/core/services/attedance";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/profile";

interface StudentAttendanceTableProps {
  data: BiodataSiswa[]; // Terima data yang difilter
  totalAttedance?: boolean;
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
  isLoading?: boolean;
  global: any;
  setGlobal: any;
  sorting: any;
  onSortingChange: any;
  filter?: any;
  setFilter: any;
}

export function SubjectAttendanceTable({
  data,
  totalAttedance,
  pagination,
  onPaginationChange,
  rowCount,
  isLoading,
  global,
  setGlobal,
  sorting,
  onSortingChange,
  filter,
  setFilter
}: StudentAttendanceTableProps) {
  const queryClient = useQueryClient();
  const alert = useAlert();
  const profile = useProfile();

  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const handleSubmitAttendance = async (
    row: any,
    status: "hadir" | "sakit" | "alfa" | "terlambat",
  ) => {
    try {
      setLoadingAttendance(true);
      await attendanceService.createAbsenMapel(row.userId)({
        status,
        mataPelajaranId: row.mataPelajaranId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["mapel-harian"],
      });

      alert.success(
        `Status ${row.namaSiswa} berhasil diubah menjadi ${status}`,
      );
    } catch (error: any) {
      alert.error(error?.message);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const isRole =
    profile?.user?.role === "admin" || profile?.user?.role === "guru";

  const columns = useMemo(
    () => matpelColumns(handleSubmitAttendance, isRole),
    [handleSubmitAttendance, isRole],
  );

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={columns}
        globalSearch
        searchParamPagination
        // showFilterButton
        enableRowSelection={false}
        manualPagination
        globalFilter={global}
        onGlobalFilterChange={setGlobal}
        sorting={sorting}
        onSortingChange={onSortingChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onFilterChange={setFilter}
        rowCount={rowCount}
        searchPlaceholder={lang.text("search")}
        isLoading={isLoading}
      />
      <Backdrop
        open={loadingAttendance}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 999,
        }}
      >
        <CircularProgress />
      </Backdrop>
    </div>
  );
}
