import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BiodataSiswa } from "@/core/models/biodata";
import { BaseDataTable } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useSchool } from "@/features/schools";
import { useMemo } from "react";
import { studentAttendanceColumn } from "../utils";

interface StudentAttendanceTableProps {
  data: BiodataSiswa[]; // Terima data yang difilter
  totalAttedance?: boolean;
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
}

export function StudentAttendanceTable({
  data,
  totalAttedance,
  // pagination,
  // sorting,
  // onSortingChange,
  pagination,
  onPaginationChange,
  rowCount,
}: StudentAttendanceTableProps) {
  const school = useSchool();
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
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      }),
    [school.data, classroom.data],
  );

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={[]}
        globalSearch
        searchParamPagination
        // initialState={{ sorting }}
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={rowCount}
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
