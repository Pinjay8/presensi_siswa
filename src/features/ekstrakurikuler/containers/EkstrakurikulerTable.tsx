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
import { ModalEkstrakurikuler } from "../components";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { CourseDataModel } from "@/core/models/course";
import { useProfile } from "@/features/profile";
import { FaPlus } from "react-icons/fa";
import { useUserCreation } from "@/features/user";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";
import { useEkstrakurikuler } from "../hooks";
import { ekstrakurikulerColumns } from "../utils";
import { EkstrakurikulerForm } from "./EkstrakurikulerForm";

export const EkstrakurikulerTable = () => {
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

  const resource = useEkstrakurikuler(params);
  const [createCourse, setCreateCourse] = useState(false);
  const [editEkstrakurikuler, setEditEkstrakurikuler] = useState<any | null>(
    null,
  );

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
      ekstrakurikulerColumns({
        onEdit: (course) => setEditEkstrakurikuler(course),
        onDelete: (course) => handleOpenDeleteDialog(course),
      }),
    [],
  );

  const filteredCourseData = useMemo(
    () => distinctObjectsByProperty(resource.data || [], "id"),
    [resource.data],
  );

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  return (
    <>
      <ModalEkstrakurikuler
        show={createCourse}
        onClose={() => setCreateCourse(false)}
      />
      <Dialog
        open={!!editEkstrakurikuler}
        onOpenChange={() => setEditEkstrakurikuler(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editEkstrakurikuler")}</DialogTitle>
          </DialogHeader>
          {editEkstrakurikuler && (
            <EkstrakurikulerForm
              onClose={() => setEditEkstrakurikuler(null)}
              initialData={{
                id: editEkstrakurikuler.id,
                nama: editEkstrakurikuler.nama,
                jenis: editEkstrakurikuler.jenis,
                pembinaId: editEkstrakurikuler.pembinaId,
                deskripsi: editEkstrakurikuler.deskripsi,
                lokasi: editEkstrakurikuler.lokasi,
                thumbnail: editEkstrakurikuler.thumbnail,
                kontak: editEkstrakurikuler.kontak,
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
                    context: lang.text("ekstrakurikuler"),
                  }),
                  icon: <FaPlus />,
                  onClick: () => setCreateCourse(true),
                },
              ]
            : []),
        ]}
        searchParamPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={resource?.pagination?.total ?? 0}
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
