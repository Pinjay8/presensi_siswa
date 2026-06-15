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

interface StudentAttendanceTableProps {
  data: BiodataSiswa[]; // Terima data yang difilter
  totalAttedance?: boolean;
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
}

export function SubjectAttendanceTable({
  data,
  totalAttedance,
  pagination,
  onPaginationChange,
  rowCount,
}: StudentAttendanceTableProps) {
  const queryClient = useQueryClient();
  const alert = useAlert();

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

  const columns = useMemo(
    () => matpelColumns(handleSubmitAttendance),
    [handleSubmitAttendance],
  );

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={[]}
        globalSearch
        searchParamPagination
        showFilterButton
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={rowCount}
        initialState={{
          columnVisibility: {
            user_email: false,
            user_nis: false,
            user_nisn: false,
          },
          sorting: [
            {
              id: "createdAt",
              desc: true,
            },
          ],
        }}
        searchPlaceholder={lang.text("search")}
        isLoading={data.length > 0 ? false : true}
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
