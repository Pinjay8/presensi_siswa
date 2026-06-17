import { useBiodata } from "@/features/user/hooks";
import {
  studentClassroomColumn,
  studentColumnWithFilter,
  tableColumnSiswaFallback,
} from "@/features/student";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo } from "react";
import { useClassroomDetail } from "../hooks";

export interface ClassroomStudentTableProps {
  id?: number;
}

export function ClassroomStudentTable(props: ClassroomStudentTableProps) {
  const detail = useClassroomDetail({ id: Number(props.id) });
  const student = useBiodata();

  const students = useMemo(
    () =>
      student.data?.filter((d) => {
        const studentSchoolId = Number(d?.user?.sekolah?.id);
        const studentClassroomId = Number(d?.kelas?.id);

        return (
          studentSchoolId === Number(detail.data?.sekolahId) &&
          studentClassroomId === Number(props?.id)
        );
      }),
    [student.data, props.id, detail?.data?.sekolahId],
  );

  const columns = useMemo(() => studentClassroomColumn({}), []);

  return (
    <BaseDataTable
      columns={columns}
      data={students}
      dataFallback={tableColumnSiswaFallback}
      globalSearch
      searchParamPagination
      // showFilterButton
      searchPlaceholder={lang.text("search")}
      isLoading={student.query.isLoading}
    />
  );
}
