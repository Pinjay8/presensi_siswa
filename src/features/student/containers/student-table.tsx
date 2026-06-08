import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks"; // Impor custom hook
import { useMemo, useState } from "react";
import {
  useClassroomOptions,
  useSchoolOptions,
} from "../hooks/use-format-school-class";
import { studentColumnWithFilter } from "../utils";
import { userService } from "@/core/services";
import RegisterFaceDialog from "@/features/_global/components/dashboard/usermenu/components/RegisterFaceDialog";
import { useAlert } from "@/features/_global";
import { lang } from "@/core/libs";
interface StudentTableProps {
  data: any[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (newPage: number) => void;
    onSizeChange: (newSize: number) => void;
  };
  sorting: any[];
  onSortingChange: (sort: any[]) => void;
}

export function StudentTable({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttend } = useAttendanceActions();
  const [openRegisterFace, setOpenRegisterFace] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const alert = useAlert();

  const handleOpenRegisterFace = (student: any) => {
    setSelectedStudent(student);
    setOpenRegisterFace(true);
  };

  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("fotoTampakDepan", file);
      formData.append("userId", String(selectedStudent.id));

      const res = await userService.registerFace(formData);

      // console.log("res", res);

      alert.success(lang.text("successRegister"));
    } catch (error: any) {
      alert.error(error?.message || "Gagal mendaftarkan wajah");
    }
  };

  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        schoolOptions,
        classroomOptions,
        handleAttend,
        onRegisterFace: handleOpenRegisterFace,
      }),
    [schoolOptions, classroomOptions],
  );

  return (
    <>
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch
        searchParamPagination
        showFilterButton
        isLoading={isLoading}
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
        schoolOptions={schoolOptions}
        classroomOptions={classroomOptions}
      />

      <RegisterFaceDialog
        open={openRegisterFace}
        onClose={() => setOpenRegisterFace(false)}
        onSubmit={handleSubmitRegisterFace}
      />
    </>
  );
}
