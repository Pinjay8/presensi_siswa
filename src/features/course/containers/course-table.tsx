import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import {
  courseColumns,
  CourseCreationForm,
  courseDataFallback,
  useCourse,
} from "@/features/course";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { ModalCreateCourse } from "../components";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import { useProfile } from "@/features/profile";
import { FaPlus } from "react-icons/fa";
import { useUserCreation } from "@/features/user";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";

export const CourseTable = () => {
  const resource = useCourse();
  const school = useSchool();
  const classroom = useClassroom();
  const [createCourse, setCreateCourse] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseDataModel | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const alert = useAlert();

  const handleOpenDeleteDialog = (parent: any) => {
    setSelectedCourse(parent);
    setOpenDelete(true);
  };
  const userDelete = useUserCreation();

  async function handleDelete() {
    try {
      await userDelete.deleteUser(Number(selectedCourse?.id));
      alert.success(lang.text("successDelete"));
      resource.query.refetch();
      setOpenDelete(false);
      setSelectedCourse(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const columns = useMemo(
    () =>
      courseColumns({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
        classroomOptions: distinctObjectsByProperty(
          classroom.data?.map((d) => ({
            label: d.namaKelas,
            value: d.namaKelas,
          })) || [],
          "value",
        ),
        onEdit: (course) => setEditCourse(course),
        onDelete: (course) => handleOpenDeleteDialog(course),
      }),
    [school.data, classroom.data],
  );

  const filteredCourseData = useMemo(
    () => distinctObjectsByProperty(resource.data || [], "namaMataPelajaran"),
    [resource.data],
  );

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  return (
    <>
      <ModalCreateCourse
        show={createCourse}
        onClose={() => setCreateCourse(false)}
      />
      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editCourse")}</DialogTitle>
          </DialogHeader>
          {editCourse && (
            <CourseCreationForm
              onClose={() => setEditCourse(null)}
              initialData={{
                id: editCourse.id,
                namaMataPelajaran: editCourse.namaMataPelajaran,
                kelasId: editCourse.kelas?.id,
                tipe: editCourse.tipe,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <BaseDataTable
        columns={columns}
        data={filteredCourseData}
        dataFallback={courseDataFallback}
        globalSearch
        showFilterButton
        actions={[
          ...(!isRole
            ? [
                {
                  title: lang.text("addWithContext", {
                    context: lang.text("course"),
                  }),
                  icon: <FaPlus />,
                  onClick: () => setCreateCourse(true),
                },
              ]
            : []),
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={userDelete.isLoading}
      />
    </>
  );
};
