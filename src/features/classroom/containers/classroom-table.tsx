import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { ModalCreateClass } from "../components";
import { useClassroom, useClassroomCreation } from "../hooks";
import { classroomColumns, classroomDataFallback } from "../utils";
import { useProfile } from "@/features/profile";
import ModalAssignSchedule from "../components/modalAssignSchedule";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";

export const ClassroomTable = () => {
  const resource = useClassroom();
  const school = useSchool();
  const [classRoom, setCreateClassRoom] = useState(false);
  const [openAssignSchedule, setOpenAssignSchedule] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const alert = useAlert();

  const handleOpenDeleteDialog = (classroom: any) => {
    setSelectedClass(classroom);
    setOpenDeleteDialog(true);
  };

  const handleOpenAssignSchedule = (classroom: any) => {
    setSelectedClass(classroom);
    setOpenAssignSchedule(true);
  };

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";
  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

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
        onDelete: handleOpenDeleteDialog,
        isAdmin,
      }),
    [school.data],
  );

  const classDelete = useClassroomCreation();

  async function handleDelete() {
    try {
      await classDelete.delete(Number(selectedClass?.id));
      alert.success(lang.text("successDelete"));
      resource.query.refetch();
      setOpenDeleteDialog(false);
    } catch (error) {
      alert.error(lang.text("failedDelete"));
    }
  }

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
                  icon: <FaPlus />,
                  onClick: () => setCreateClassRoom(!classRoom),
                },
              ]
            : []),
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{lang.text("delete")}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {lang.text("deleteMessage", { context: selectedClass?.user_name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            {lang.text("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={classDelete.isLoading}
            variant="contained"
            color="primary"
          >
            {lang.text("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
