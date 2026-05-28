import { useBiodata, useUserDetail } from "@/features/user/hooks";
import { studentColumnWithFilter } from "@/features/student";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo } from "react";

export interface ParentStudentTableProps {
  id?: number;
}

export function ParentStudentTable(props: ParentStudentTableProps) {
  const parent = useUserDetail(Number(props.id));
  const biodata = useBiodata();
  if (typeof biodata.data === "string") {
    biodata.data = JSON.parse(biodata.data);
  }


  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        schoolOptions: [],
      }),
    [],
  );

  const datas = useMemo(() => {
    return biodata.data?.filter((d) =>
      Boolean(d.orangTua?.find((e) => e.user?.nik === parent.data?.nik)),
    );
  }, [biodata.data, parent.data?.nik]);

  return (
    <BaseDataTable
      columns={columns}
      data={datas}
      dataFallback={[]}
      globalSearch={false}
      searchPlaceholder={lang.text("search")}
      isLoading={biodata.query.isLoading}
    />
  );
}
