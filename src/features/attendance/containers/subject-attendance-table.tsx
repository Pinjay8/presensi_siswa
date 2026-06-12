import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BiodataSiswa } from "@/core/models/biodata";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";

import { matpelColumns } from "../utils";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DialogTitle } from "@radix-ui/react-dialog";
import { attendanceService } from "@/core/services/attedance";
import { useQueryClient } from "@tanstack/react-query";

interface StudentAttendanceTableProps {
  data: BiodataSiswa[]; // Terima data yang difilter
  totalAttedance?: boolean;
}

export function SubjectAttendanceTable({
  data,
  totalAttedance,
}: StudentAttendanceTableProps) {
  const school = useSchool();
  const classroom = useClassroom();

  // const columns = useMemo(
  //   () =>
  //     matpelColumns({
  //       classroomOptions: distinctObjectsByProperty(
  //         classroom.data?.map((d) => ({
  //           label: d.namaKelas,
  //           value: d.namaKelas,
  //         })) || [],
  //         "value",
  //       ),
  //       schoolOptions: distinctObjectsByProperty(
  //         school.data?.map((d) => ({
  //           label: d.namaSekolah,
  //           value: d.namaSekolah,
  //         })) || [],
  //         "value",
  //       ),
  //     }),
  //   [school.data, classroom.data],
  // );

  const queryClient = useQueryClient();
  const alert = useAlert();

  const handleSubmitAttendance = async (
    row: any,
    status: "hadir" | "sakit" | "alfa" | "terlambat",
  ) => {
    try {
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
    </div>
  );
}
