import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchedulerCreation } from "../hooks/use-scheduler-creation";
import { useMemo, useState } from "react";
import { useProfile } from "@/features/profile";
import { schedulerColumns, schedulerDataFallback } from "../utils/table-column";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const SchedulerTable = () => {
    const alert = useAlert();
    const navigate = useNavigate();
    const resource = useSchedulerCreation();
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

          {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{lang.text("delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {lang.text("deleteMessage", { context: selectedSchedule?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{lang.text("cancel")}</Button>
          <Button onClick={handleDelete} disabled={resource.isLoading}>{lang.text("delete")}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}