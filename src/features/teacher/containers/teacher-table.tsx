import { useBiodataGuru } from "@/features/user/hooks";
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

export function TeacherTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
  const [openWaliKelas, setOpenWaliKelas] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const kelas = useClassroom();
  const alert = useAlert();
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
      }),
    [school.data],
  );

  const profile = useProfile();
  const isRole = profile?.user?.role === "guru" || profile?.user?.role === "siswa";
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
    },

    onError: (error: any) => {
      alert.error(error?.message || "Gagal menambahkan wali kelas");
    },
  });

  return (
    <>
      {
        <ModalCreateTeacher
          show={teacher}
          onClose={() => setTeacher(!teacher)}
        />
      }
      <ModalAssignSchedule
        open={openAssignSchedule}
        selectedTeacher={selectedTeacher}
        onClose={() => setOpenAssignSchedule(false)}
      />
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
                  onClick: () => navigate("/teachers/create"),
                },
              ]
            : []),
        ]}
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
    </>
  );
}
