import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { ModalCreateClass } from "../components";
import { useClassroom } from "../hooks";
import { classroomColumns, classroomDataFallback } from "../utils";

export const ClassroomTable = () => {
  const resource = useClassroom();
  const school = useSchool();
  const [classRoom, setCreateClassRoom] = useState(false);

  const columns = useMemo(
    () =>
      classroomColumns({
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
        <ModalCreateClass
          show={classRoom}
          onClose={() => setCreateClassRoom(!classRoom)}
        />
      }
      <BaseDataTable
        columns={columns}
        data={resource.data}
        dataFallback={classroomDataFallback}
        globalSearch
        showFilterButton
        // pageSize={5}
        actions={[
          {
            title: lang.text("addClassroom"),
            onClick: () => setCreateClassRoom(!classRoom),
          },
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
    </>
  );
};
