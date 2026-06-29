import { distinctObjectsByProperty, lang } from "@/core/libs";
import {
  BaseDataTable,
  useAlert,
  useDataTableController,
} from "@/features/_global";
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
import { Divider } from "@mui/material";
import { useCoursePagination } from "../hooks/useCoursePagination";
import { courseService } from "@/core/services";
import { useQueryClient } from "@tanstack/react-query";

export const CourseTable = () => {
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

  // const resource = useCourse();
  const {
    data: resource,
    pagination: paginationInfo,
    isLoading,
    query,
  } = useCoursePagination(params);
  const school = useSchool();
  const classroom = useClassroom();
  const [createCourse, setCreateCourse] = useState(false);
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const alert = useAlert();

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";
  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

  const handleOpenDeleteDialog = (parent: any) => {
    setSelectedCourse(parent);
    setOpenDelete(true);
  };
  const userDelete = useUserCreation();

  const queryClient = useQueryClient();

  async function handleDelete() {
    try {
      await courseService.delete(Number(selectedCourse?.id));
      alert.success(lang.text("successDelete"));
      await queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      setOpenDelete(false);
      setSelectedCourse(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const columns = useMemo(
    () =>
      courseColumns({
        isAdmin,
        onEdit: (course: any) => {
          console.log("COURSE", course);
          console.log("KELAS", course.kelas);

          setEditCourse(course);
        },
        onDelete: (course: any) => handleOpenDeleteDialog(course),
      }),
    [resource],
  );

  const filteredCourseData = useMemo(
    () => distinctObjectsByProperty(resource || [], "namaMataPelajaran"),
    [resource],
  );

  return (
    <>
      <ModalCreateCourse
        show={createCourse}
        onClose={() => setCreateCourse(false)}
      />
      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent className="max-w-2xl w-full pt-10">
          <DialogHeader>
            <DialogTitle style={{ marginTop: "5px" }}>
              {lang.text("editCourse")}
            </DialogTitle>
          </DialogHeader>
          <Divider />
          {editCourse && (
            <CourseCreationForm
              onClose={() => setEditCourse(null)}
              initialData={{
                id: editCourse.id,
                namaMataPelajaran: editCourse.namaMataPelajaran,
                kode: editCourse.kode,
                kelompok: editCourse.kelompok,
                kelas:
                  editCourse.mapelKelas?.map((item: any) => ({
                    kelasId: item.kelas?.id,
                    guruId: item.guru?.id,
                  })) ?? [],
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
        rowCount={paginationInfo?.total ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        searchPlaceholder={lang.text("search")}
        isLoading={isLoading}
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
