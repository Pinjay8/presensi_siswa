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
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import RegisterFaceDialog from "@/features/_global/components/dashboard/usermenu/components/RegisterFaceDialog";
import { userService } from "@/core/services";

export function TeacherTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
  const [openWaliKelas, setOpenWaliKelas] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [openDelete, setOpenDelete] = useState(false)
    const [openRegisterFace, setOpenRegisterFace] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const kelas = useClassroom();
  const alert = useAlert();

    const handleOpenRegisterFace = (teacher: any) => {
    setSelectedTeacher(teacher);
    console.log("selected Teacher", selectedTeacher)
    setOpenRegisterFace(true);
  };
  
  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("fotoTampakDepan", file);
      formData.append("userId", String(selectedTeacher.user?.id));
      console.log("selected Teacher", selectedTeacher.user?.id)
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

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{lang.text("delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {lang.text("deleteMessage", { context: selectedTeacher?.user_name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>{lang.text("cancel")}</Button>
          <Button onClick={handleDelete} disabled={userDelete.isLoading}>{lang.text("delete")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
