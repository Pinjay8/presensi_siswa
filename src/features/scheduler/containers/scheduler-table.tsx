import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchedulerCreation } from "../hooks/use-scheduler-creation";
import { useMemo, useState } from "react";
import { useProfile } from "@/features/profile";
import { schedulerColumns, schedulerDataFallback } from "../utils/table-column";
import { useNavigate } from "react-router-dom";

export const SchedulerTable = () => {
    const navigate = useNavigate();
    const resource = useSchedulerCreation();

    const columns = useMemo(() => 
        schedulerColumns({}),
    [resource]
    )
    
  const profile = useProfile();
  const isRole = profile?.user?.role === "guru" || profile?.user?.role === "siswa" || profile?.user?.role === "orangTua";

  return (
    <>
    <BaseDataTable
    columns={columns}
    data={resource.data}
    dataFallback={schedulerDataFallback}
    globalSearch
    showFilterButton
    actions={[
        ...(!isRole

            ? [
                {
                    title: lang.text("createSchedule"),
                    onClick: () => navigate("/scheduler/create"),
                }
            ]
            :[]
        )
    ]}
    searchParamPagination
    searchPlaceholder={lang.text("search")}
    isLoading={resource.isLoading}
    />
    </>
  )
}