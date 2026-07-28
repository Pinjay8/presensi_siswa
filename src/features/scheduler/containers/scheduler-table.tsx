import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert, useDataTableController } from "@/features/_global";
import { useSchedulerCreation } from "../hooks/use-scheduler-creation";
import { useMemo, useState } from "react";
import { useProfile } from "@/features/profile";
import { schedulerColumns, schedulerDataFallback } from "../utils/table-column";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";

export const SchedulerTable = () => {
  const alert = useAlert();
  const navigate = useNavigate();

  // const resource = useSchedulerCreation();
  const {
    global,
    setGlobal,
    sorting,
    filter,
    setFilter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
    defaultSorting: [{ id: "updatedAt", desc: true }],
  });

  const params: any = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
    sortBy: sorting?.[0]?.id,
    sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
    ...filter,
  };

  const resource = useSchedulerCreation(params);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (scheduler: any) => {
    setSelectedSchedule(scheduler);
    setOpenDeleteDialog(true);
  }

  const handleCloseDeleteDialog = () => {
    setSelectedSchedule(null);
    setOpenDeleteDialog(false);
  }

  async function handleDelete() {
    try {
      await resource.deleteScheduler(selectedSchedule?.id);
      alert.success(lang.text("successDelete"));
      resource.query.refetch();
      handleCloseDeleteDialog();
      setSelectedSchedule(null);
    } catch (error: any) {
      alert.error(error?.message || lang.text("failedDelete"))
    }
  }

  const columns = useMemo(() =>
    schedulerColumns({
      onDelete: handleOpenDeleteDialog,
    }),
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
        searchParamPagination
        showFilterButton

        globalFilter={global}
        onGlobalFilterChange={setGlobal}

        sorting={sorting}
        onSortingChange={onSortingChange}

        pagination={pagination}
        onPaginationChange={onPaginationChange}

        onFilterChange={setFilter}

        manualPagination
        rowCount={resource.pagination?.total ?? 0}

        searchPlaceholder={lang.text("search")}
        isLoading={resource.isLoading}
        actions={[
          ...(!isRole

            ? [
              {
                icon: <FaPlus />,
                title: lang.text("createSchedule"),
                onClick: () => navigate("/scheduler/create"),
              }
            ]
            : []
          )
        ]}
      />


      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        loading={resource.isLoading}
        message={lang.text("deleteMessage", {
          context: lang.text("scheduler"),
        })}
      />

    </>
  )
}