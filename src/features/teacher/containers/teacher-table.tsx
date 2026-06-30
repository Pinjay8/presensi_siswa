import { useBiodataGuru, useUserCreation } from "@/features/user/hooks";
import { BaseDataTable, useAlert } from "@/features/_global";
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
import { useMutation } from "@tanstack/react-query";
import ModalAssignSchedule from "../components/modalAssignSchedule";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import RegisterFaceDialog from "@/features/_global/components/dashboard/usermenu/components/RegisterFaceDialog";
import { userService } from "@/core/services";
import { uploadExcelService } from "@/core/services/excel";
import { Download, UploadCloud } from "lucide-react";
import { UploadScheduleDialog } from "@/features/schedules/components/UploadScheduleDialog";

export function TeacherTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
  const [openWaliKelas, setOpenWaliKelas] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegisterFace, setOpenRegisterFace] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const kelas = useClassroom();
  const alert = useAlert();

  const handleOpenRegisterFace = (teacher: any) => {
    setSelectedTeacher(teacher);
    console.log("selected Teacher", selectedTeacher);
    setOpenRegisterFace(true);
  };

  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("fotoTampakDepan", file);
      formData.append("userId", String(selectedTeacher.user?.id));
      console.log("selected Teacher", selectedTeacher.user?.id);
      await userService.registerFaceTeacher(formData);

      alert.success(lang.text("successRegister"));
    } catch (error: any) {
      alert.error(error?.message || "Gagal mendaftarkan wajah");
    }
  };
  const columns = useMemo(
    () =>
      teacherColumnWithFilter({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),

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
    mutationFn: (payload: { guruId: number; kelasId: number }) => {
      return teacherService.create(payload);
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

      alert.success("Template Excel berhasil diunduh");
    } catch (err: any) {
      alert.error(
        "Gagal mengunduh template Excel: " + (err.message || "Unknown error"),
      );
    }
  };

  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error("Pilih file Excel terlebih dahulu");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "guru");

      await uploadExcelService.importExcel(formData);

      alert.success("Import data guru berhasil");

      await biodata.query.refetch();

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(err?.message ?? "Gagal mengunggah file Excel");
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
          onSubmit={(payload) => {
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
        initialState={{
          sorting: [
            {
              id: "user_name",
              desc: false,
            },
          ],
        }}
        actions={[
          ...(!isRole
            ? [
                {
                  title: "Unduh Template Excel",
                  icon: <Download />,
                  onClick: handleDownloadTemplate,
                  variant: "default",
                  className: "bg-green-500 text-white hover:bg-green-600",
                },

                {
                  title: "Unggah Excel",
                  icon: <UploadCloud />,
                  onClick: () => setIsUploadModalOpen(true),
                  variant: "outline",
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
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
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

      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{lang.text("delete")}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {lang.text("deleteMessage", {
              context: selectedTeacher?.user_name,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            color="primary"
          >
            {lang.text("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={userDelete.isLoading}
            variant="contained"
            color="primary"
          >
            {lang.text("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
