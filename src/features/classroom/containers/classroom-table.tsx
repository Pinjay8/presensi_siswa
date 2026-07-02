import { distinctObjectsByProperty, lang } from "@/core/libs";
import {
  BaseDataTable,
  useAlert,
  useDataTableController,
} from "@/features/_global";
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
import { useClassroomPaginated } from "../hooks/use-classroom-paginated";
import { Download, UploadCloud } from "lucide-react";
import { UploadScheduleDialog } from "@/features/schedules/components/UploadScheduleDialog";
import { uploadExcelService } from "@/core/services/excel";

export const ClassroomTable = () => {
  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
  });

  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };

  const {
    data: classroom,
    pagination: paginationInfo,
    isLoading,
    query,
  } = useClassroomPaginated(params);
  const [excelFile, setExcelFile] = useState<File | null>(null);

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
        // columnFilter: {
        //   schoolOptions: distinctObjectsByProperty(
        //     school.data?.map((d) => ({
        //       label: d.namaSekolah,
        //       value: d.namaSekolah,
        //     })) || [],
        //     "value",
        //   ),
        // },
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
      await query.refetch();
      setOpenDeleteDialog(false);
    } catch (error) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://docs.google.com/spreadsheets/d/1OeZdlcFtt4SyVNIDY37txSC-35KoNuAQ/export?format=xlsx";
      link.download = "template_kelas.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert.success(
        lang.text("successDownloadTemplateExcel", {
          context: lang.text("classroom"),
        }),
      );
    } catch (err: any) {
      alert.error(
        err.message ||
          lang.text("failedDownloadTemplateExcel", {
            context: lang.text("classroom"),
          }),
      );
    }
  };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error(lang.text("selectExcelFirst"));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "kelas");

      await uploadExcelService.importExcel(formData);

      alert.success(lang.text("successImportData", {
        context: lang.text("classroom"),
      }));

      await query.refetch();

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(
        err?.message ?? lang.text("failedImportData", { context: lang.text("classroom") })
      );
    }
  };

  return (
    <>
      {!isRole && (
        <>
          <ModalCreateClass
            show={classRoom}
            onClose={() => setCreateClassRoom(!classRoom)}
          />
        </>
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
        data={classroom}
        dataFallback={classroomDataFallback}
        globalSearch
        showFilterButton
        actions={[
          ...(!isRole
            ? [
                {
                  title: "Unduh Template Excel",
                  icon: <Download />,
                  onClick: handleDownloadTemplate,
                  variant: "default",
                  className: "bg-green-500 text-white hover:bg-green-600",
                },

                {
                  title: "Unggah Excel",
                  icon: <UploadCloud />,
                  onClick: () => setIsUploadModalOpen(true),
                  variant: "outline",
                  className:
                    "border-green-500 text-green-500 hover:bg-green-50",
                },
                {
                  title: lang.text("addClassroom"),
                  icon: <FaPlus />,
                  variant: "default",
                  onClick: () => setCreateClassRoom(!classRoom),
                },
              ]
            : []),
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("searchClass")}
        isLoading={isLoading}
        manualPagination
        rowCount={paginationInfo?.total ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />

      <UploadScheduleDialog
        open={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);

          if (!open) {
            setExcelFile(null);
          }
        }}
        setExcelFile={setExcelFile}
        handleUploadExcel={handleUploadExcel}
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
