import { useBiodata, useUserDetail } from "@/features/user/hooks";
import { studentColumn, studentColumnWithFilter } from "@/features/student";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo } from "react";
import { useChildParent } from "@/features/user/hooks/useChildParent";

export interface ParentStudentTableProps {
  id?: number;
}

export function ParentStudentTable(props: ParentStudentTableProps) {
  // const parent = useUserDetail(Number(props.id));

  const childParent = useChildParent(props.id as number);
  // const biodata = useBiodata();
  // if (typeof biodata.data === "string") {
  //   biodata.data = JSON.parse(biodata.data);
  // }

  const columns = useMemo(
    () =>
      // studentColumnWithFilter({
      //   schoolOptions: [],
      // }),
      studentColumn(),
    [],
  );

  // const datas = useMemo(() => {
  //   return biodata.data?.filter((d) =>
  //     Boolean(d.orangTua?.find((e) => e.user?.nik === parent.data?.nik)),
  //   );
  // }, [biodata.data, parent.data?.nik]);

  return (
    <BaseDataTable
      columns={columns}
      data={childParent.data || []}
      dataFallback={[]}
      globalSearch={false}
      searchPlaceholder={lang.text("search")}
      isLoading={childParent.query.isLoading}
    />
  );
}
