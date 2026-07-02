import { useBiodata } from "@/features/user/hooks";
import {
  checkAttendance,
  studentColumnSchool,
  studentColumnWithFilter,
  tableColumnSiswaFallback,
  useAttedances,
  useStudentPagination,
} from "@/features/student";
import { BaseDataTable, useDataTableController } from "@/features/_global";
import { lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useEffect, useState } from "react";
import { StudentMoodleTable } from "../../student/containers/student-moodle";
import { useProfile } from "@/features/profile";

export interface SchoolStudentProps {
  id: number;
}

// Definisi tipe Detail sesuai dengan yang diharapkan oleh StudentMoodleTable
interface Detail {
  id: number;
  data: {
    user: {
      sekolahId: number;
      nis: number;
    };
  };
}

export function SchoolStudentTable(props: SchoolStudentProps) {
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 10 });

  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    }),
    [pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, refetch } = useStudentPagination(studentParams);

  // State untuk data yang akan dikirim ke StudentMoodleTable
  const [selectedStudent, setSelectedStudent] = useState<Detail | null>(null);

  const columns = useMemo(() => {
    const columnData = studentColumnSchool({
      noStatus: true,
    });
    return columnData;
  }, []);

  const handleStudentClick = (student: any) => {
    const studentDetail: Detail = {
      id: student.id, // Menambahkan id
      data: {
        user: {
          sekolahId: student.user?.sekolah?.id || 0,
          nis: Number(student.user?.nis) || 0,
        },
      },
    };
    setSelectedStudent(studentDetail);
  };

  return (
    <div>
      <BaseDataTable
        columns={columns}
        data={data?.students || []}
        dataFallback={tableColumnSiswaFallback}
        globalSearch
        searchPlaceholder={lang.text("search")}
        isLoading={isLoading}
        onRowClick={handleStudentClick}
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={data?.pagination?.totalItems ?? 0}
      />
      {selectedStudent && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detail Siswa</h3>
          <StudentMoodleTable detail={selectedStudent} />
        </div>
      )}
    </div>
  );
}
