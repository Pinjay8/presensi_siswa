import { useBiodata } from "@/features/user/hooks";
import { parentColumnWithFilter } from "../utils";
import { BaseDataTable } from "@/features/_global";
import { distinctObjectsByProperty } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { useParent } from "../hooks";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { ModalCreateParents } from "../components/ModalCreateParents";
import { useProfile } from "@/features/profile";
export function ParentTable() {
  const parent = useParent();
  const student = useBiodata();
  const navigate = useNavigate();
  const school = useSchool();

  const columns = useMemo(() => {
    return parentColumnWithFilter({
      schoolOptions: distinctObjectsByProperty(
        school.data?.map((d) => ({
          label: d.namaSekolah,
          value: d.namaSekolah,
        })) || [],
        "value",
      ),
    });
  }, [school.data]);

  const biodataStudents = useMemo(() => {
    try {
      return typeof student.data === "string"
        ? JSON.parse(student.data)
        : student.data || [];
    } catch (error) {
      console.error("Failed parse biodata", error);
      return [];
    }
  }, [student.data]);

  const datas = useMemo(() => {
    return parent.data?.map((d) => {
      return {
        ...d,
        student: biodataStudents?.find((e: any) =>
          Boolean(e.orangTua?.find((f: any) => f.user?.nik === d.nik)),
        ),
        school: school?.data?.find((e) => Number(e.id) === Number(d.sekolahId)),
      };
    });
  }, [parent.data, student.data, school.data]);

  const [parents, setParents] = useState(false);

  const profile = useProfile();
  const isTeacher = profile?.user?.role === "guru";
  return (
    <>
      {
        <ModalCreateParents
          show={parents}
          onClose={() => setParents(!parents)}
        />
      }
      <BaseDataTable
        columns={columns}
        data={datas}
        dataFallback={[]}
        globalSearch
        initialState={{
          sorting: [{ id: "name", desc: false }],
        }}
        actions={[
          ...(!isTeacher
            ? [
                {
                  title: lang.text("createParent"),
                  onClick: () => navigate("/parents/create"),
                },
              ]
            : []),
        ]}
        searchParamPagination
        showFilterButton
        searchPlaceholder={lang.text("search")}
        isLoading={
          parent.query.isLoading || student.isLoading || school.isLoading
        }
      />
    </>
  );
}
