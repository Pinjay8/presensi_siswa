import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable } from "@/features/_global";
import { distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { teacherColumnWithFilter } from "../utils";
import { useNavigate } from "react-router-dom";
import { ModalCreateTeacher } from "../components/ModalCreateTeacher";

export function TeacherTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
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
      }),
    [school.data],
  );

  return (
    <>
      {
        <ModalCreateTeacher
          show={teacher}
          onClose={() => setTeacher(!teacher)}
        />
      }
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
          {
            title: lang.text("addTeacher"),
            onClick: () => navigate("/teachers/create"),
          },
        ]}
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
    </>
  );
}
