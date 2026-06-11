import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { ModalCreateClass } from "../components";
import { useClassroom } from "../hooks";
import { classroomColumns, classroomDataFallback } from "../utils";
import { useProfile } from "@/features/profile";
import ModalAssignSchedule from "../components/modalAssignSchedule";

export const ClassroomTable = () => {
  const resource = useClassroom();
  const school = useSchool();
  const [classRoom, setCreateClassRoom] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const alert = useAlert();

  const handleOpenAssignSchedule = (classroom: any) => {
    setSelectedClass(classroom);
    setOpenAssignSchedule(true);
  }

  const columns = useMemo(
    () =>
      classroomColumns({
        columnFilter: {
          schoolOptions: distinctObjectsByProperty(
            school.data?.map((d) => ({
              label: d.namaSekolah,
              value: d.namaSekolah,
            })) || [],
            "value",
          ),
        },
        onAssignSchedule: handleOpenAssignSchedule,
      }),
    [school.data],
  );

  const profile = useProfile();
  const isRole = profile?.user?.role === "guru" || profile?.user?.role === "siswa" || profile?.user?.role === "orangTua";

  return (
    <>
      {!isRole && (
        <ModalCreateClass
          show={classRoom}
          onClose={() => setCreateClassRoom(!classRoom)}
        />
      )}
      {!isRole && (
        <ModalAssignSchedule
          open={openAssignSchedule}
          onClose={() => setOpenAssignSchedule(!openAssignSchedule)}
          selectedClass={selectedClass}
        />
      )}
      <BaseDataTable
        columns={columns}
        data={resource.data}
        dataFallback={classroomDataFallback}
        globalSearch
        showFilterButton
        actions={[
          ...(!isRole
            ? [
                {
                  title: lang.text("addClassroom"),
                  onClick: () => setCreateClassRoom(!classRoom),
                },
              ]
            : []),
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
    </>
  );
};
