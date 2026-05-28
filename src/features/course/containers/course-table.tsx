import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
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

export const CourseTable = () => {
  const resource = useCourse();
  const school = useSchool();
  const classroom = useClassroom();
  const [createCourse, setCreateCourse] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseDataModel | null>(null);

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
      }),
    [school.data, classroom.data],
  );

  const filteredCourseData = useMemo(
    () =>
      distinctObjectsByProperty(resource.data || [], "namaMataPelajaran"),
    [resource.data],
  );

  console.log('editCourse', editCourse);

  return (
    <>
      <ModalCreateCourse show={createCourse} onClose={() => setCreateCourse(false)} />
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
                sekolahId: editCourse.sekolah?.id,
                kelasId: editCourse.kelas?.id,
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
          {
            title: lang.text("addWithContext", { context: lang.text("course") }),
            onClick: () => setCreateCourse(true),
          },
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
    </>
  );
};