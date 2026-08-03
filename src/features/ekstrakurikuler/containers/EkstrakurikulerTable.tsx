import {
  distinctObjectsByProperty,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import {
  BaseDataTable,
  useAlert,
  useDataTableController,
} from "@/features/_global";
import {
  courseDataFallback,
  useCourse,
} from "@/features/course";
import { useMemo, useState } from "react";
import { ModalEkstrakurikuler } from "../components";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { useProfile } from "@/features/profile";
import { FaPlus } from "react-icons/fa";
import { useUserCreation } from "@/features/user";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";
import { useEkstrakurikuler } from "../hooks";
import { ekstrakurikulerColumns } from "../utils";
import { EkstrakurikulerForm } from "./EkstrakurikulerForm";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { Divider } from "@mui/material";
import { EditEkstrakurikulerDialog } from "../components/modalEditEkstra";

export const EkstrakurikulerTable = () => {
  const {
    global,
    setGlobal,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
    defaultSorting: [
      {
        id: "updatedAt",
        desc: true,
      },
    ],
  });

  const [jenis, setJenis] = useState<string>("ALL");

  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
    sortBy: sorting?.[0]?.id,
    sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
    ...(jenis !== "ALL" && { jenis }),
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

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";
  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

  async function handleDelete() {
    try {
      await ekstrakurikulerService.delete(Number(selectedCourse?.id));
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
        isAdmin,
        onEdit: (course) => setEditEkstrakurikuler(course),
        onDelete: (course) => handleOpenDeleteDialog(course),
      }),
    [],
  );

  const filteredCourseData = useMemo(
    () => distinctObjectsByProperty(resource.data || [], "id"),
    [resource.data],
  );

  return (
    <div>
      <ModalEkstrakurikuler
        show={createCourse}
        onClose={() => setCreateCourse(false)}
      />
      {/* <Dialog
        open={!!editEkstrakurikuler}
        onOpenChange={() => setEditEkstrakurikuler(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ marginTop: '12px' }}>{lang.text("editEkstrakurikuler")}</DialogTitle>
          </DialogHeader>
          <Divider />

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
      </Dialog> */}

      <EditEkstrakurikulerDialog
        open={!!editEkstrakurikuler}
        data={editEkstrakurikuler}
        onClose={() => setEditEkstrakurikuler(null)}
        lang={lang}
      />
      <BaseDataTable
        columns={columns}
        data={filteredCourseData}
        dataFallback={courseDataFallback}
        globalSearch
        // showFilterButton
        sorting={sorting}
        onSortingChange={onSortingChange}
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
        globalFilter={global}
        onGlobalFilterChange={setGlobal}
        onPaginationChange={onPaginationChange}
        rowCount={resource?.pagination?.total ?? 0}
        searchPlaceholder={lang.text("search") + " " + lang.text("ekstrakurikuler")}
        isLoading={resource.query.isLoading}
        actionContent={
          <Select
            value={jenis}
            onValueChange={(value) => {
              setJenis(value);
              onPaginationChange({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Jenis" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="OLAHRAGA">Olahraga</SelectItem>
              <SelectItem value="SENI">Seni</SelectItem>
              <SelectItem value="AKADEMIK">Akademik</SelectItem>
              <SelectItem value="KEAGAMAAN">Keagamaan</SelectItem>
              <SelectItem value="LAINNYA">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={userDelete.isLoading}
        message={lang.text("deleteMessage", {
          context: lang.text("ekstrakurikuler"),
        })}
      />
    </div>
  );
};
