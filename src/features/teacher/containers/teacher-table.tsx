import { useBiodataGuru, useBiodataGuruPaginated, useUserCreation } from "@/features/user/hooks";
import { BaseDataTable, useAlert, useDataTableController } from "@/features/_global";
import { distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { teacherColumnWithFilter } from "../utils";
import { useNavigate } from "react-router-dom";
import { ModalCreateTeacher } from "../components/ModalCreateTeacher";
import { useProfile } from "@/features/profile";
import { ModalAssignWaliKelas } from "../components/ModalAssignWaliKelas";
import { useClassroom } from "@/features/classroom";
import { teacherService } from "@/core/services/teacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ModalAssignSchedule from "../components/modalAssignSchedule";
import { FaPlus } from "react-icons/fa";
import RegisterFaceDialog from "@/features/_global/components/dashboard/usermenu/components/RegisterFaceDialog";
import { userService } from "@/core/services";
import { uploadExcelService } from "@/core/services/excel";
import { Download, UploadCloud } from "lucide-react";
import { UploadScheduleDialog } from "@/features/schedules/components/UploadScheduleDialog";
import { cdnService } from "@/core/services/cdn";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";

export function TeacherTable() {
  // const biodata = useBiodataGuru();
  const {
    global,
    setGlobal,
    sorting,
    pagination,
    filter,
    setFilter,
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



  const params: any = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
    sortBy: sorting?.[0]?.id,
    sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
    ...filter,
  };

  const biodata = useBiodataGuruPaginated(params);

  const school = useSchool();
  const classRoom = useClassroom();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
  const [openWaliKelas, setOpenWaliKelas] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegisterFace, setOpenRegisterFace] = useState(false);
  const queryClient = useQueryClient();
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const kelas = useClassroom();
  const alert = useAlert();

  const handleOpenRegisterFace = (teacher: any) => {
    setSelectedTeacher(teacher);
    setOpenRegisterFace(true);
  };

  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadResponse = await cdnService.uploadFile(uploadFormData);
      const fileUrl = uploadResponse?.collection?.data?.[0]?.fileUrl;

      if (!fileUrl) {
        throw new Error("Failed to upload image");
      }
      await userService.registerFaceTeacher({
        userId: selectedTeacher.id,
        fotoTampakDepan: fileUrl,
      });

      biodata.query.refetch();
      alert.success(lang.text("successRegister"));
    } catch (error: any) {
      alert.error(error?.message || lang.text("failedRegisterFace"));
    }
  };
  const columns = useMemo(
    () =>
      teacherColumnWithFilter({
        onWaliKelas: (teacher: any) => {
          setSelectedTeacher(teacher);
          setOpenWaliKelas(true);
        },
        onAssignSchedule: (teacher: any) => {
          setSelectedTeacher(teacher);
          setOpenAssignSchedule(true);
        },
        onDelete: (teacher: any) => {
          setSelectedTeacher(teacher);
          setOpenDelete(true);
        },
        onRegisterFace: handleOpenRegisterFace,
      }),
    [school.data],
  );

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" || profile?.user?.role === "siswa";
  const assignWaliKelasMutation = useMutation({
    mutationFn: (payload: {
      guruId: number;
      kelasId: number[];
    }) => {
      const hasData = (selectedTeacher?.waliKelas?.length ?? 0) > 0;

      return hasData
        ? teacherService.update(payload)
        : teacherService.create(payload);
    },

    onSuccess: () => {
      alert.success(
        lang.text("successCreate", { context: lang.text("homeroom-teacher") }),
      );
      setOpenWaliKelas(false);
      setSelectedTeacher(null);
      biodata.query.refetch();
    },

    onError: (error: any) => {
      alert.error(error?.message || "Gagal menambahkan wali kelas");
    },
  });

  const userDelete = useUserCreation();

  async function handleDelete() {
    try {
      await userDelete.deleteUser(Number(selectedTeacher?.userId));
      alert.success(lang.text("successDelete"));
      biodata.query.refetch();
      setOpenDelete(false);
      setSelectedTeacher(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://docs.google.com/spreadsheets/d/19WBX0sRxX7kGm-Y2wXxCzvdKOVWqhFeg/export?format=xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert.success(
        lang.text("successDownloadTemplateExcel", {
          context: lang.text("teacher"),
        }),
      );
    } catch (err: any) {
      alert.error(
        lang.text("failedDownloadTemplateExcel", {
          context: lang.text("teacher"),
        }),
      );
    }
  };

  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error(lang.text("selectExcelFirst"));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "guru");

      await uploadExcelService.importExcel(formData);

      alert.success(
        lang.text("successImportData", {
          context: lang.text("teacher"),
        }),
      );

      await biodata.query.refetch();

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(
        err?.message ??
        lang.text("failedImportData", { context: lang.text("teacher") }),
      );
    }
  };

  return (
    <>
      {!isRole && (
        <ModalCreateTeacher
          show={teacher}
          onClose={() => setTeacher(!teacher)}
        />
      )}
      {!isRole && (
        <ModalAssignSchedule
          open={openAssignSchedule}
          selectedTeacher={selectedTeacher}
          onClose={() => setOpenAssignSchedule(false)}
        />
      )}
      {!isRole && (
        <ModalAssignWaliKelas
          open={openWaliKelas}
          teacher={selectedTeacher}
          kelasOptions={
            kelas.data?.map((d) => ({
              label: d.namaKelas,
              value: String(d.id),
            })) ?? []
          }
          onClose={() => setOpenWaliKelas(false)}
          onSubmit={(payload: any) => {
            assignWaliKelasMutation.mutate(payload);
          }}
        />
      )}
      <BaseDataTable
        columns={columns}
        data={biodata.data}
        dataFallback={columns}
        globalSearch
        searchParamPagination
        showFilterButton
        sorting={sorting}
        onSortingChange={onSortingChange}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        globalFilter={global}
        onGlobalFilterChange={setGlobal}
        actions={[
          ...(!isRole
            ? [
              {
                title: lang.text("downloadTemplateExcel"),
                icon: <Download />,
                onClick: handleDownloadTemplate,
                variant: "default" as const,
                className: "bg-green-500 text-white hover:bg-green-600",
              },

              {
                title: lang.text("uploadExcel"),
                icon: <UploadCloud />,
                onClick: () => setIsUploadModalOpen(true),
                variant: "outline" as const,
                className:
                  "border-green-500 text-green-500 hover:bg-green-50",
              },
              {
                title: lang.text("addTeacher"),
                icon: <FaPlus />,
                onClick: () => navigate("/teachers/create"),
              },
            ]
            : []),
        ]}
        searchPlaceholder={lang.text("search") + " " + lang.text("teacher")}
        isLoading={biodata.query.isLoading}
        filters={[
          {
            id: "kelasId",
            label: lang.text("classroom"),
            variant: "select",
            placeholder: lang.text("chooseClassroom"),
            options: classRoom.data?.map((d) => ({
              label: d.namaKelas,
              value: String(d.id),
            })),
          },
        ]}
        onFilterChange={setFilter}
      />

      <RegisterFaceDialog
        open={openRegisterFace}
        onClose={() => setOpenRegisterFace(false)}
        onSubmit={handleSubmitRegisterFace}
      />

      <UploadScheduleDialog
        open={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);

          if (!open) {
            setExcelFile(null);
          }
        }}
        setExcelFile={setExcelFile}
        handleUploadExcel={handleUploadExcel}
      />

      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={userDelete.isLoading}
        message={lang.text("deleteMessage", { context: lang.text("teacher") })}
      />

    </>
  );
}
