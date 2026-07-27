import { useBiodata, useUserCreation } from "@/features/user/hooks";
import { parentColumnWithFilter } from "../utils";
import { BaseDataTable, useAlert, useDataTableController } from "@/features/_global";
import { distinctObjectsByProperty } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useEffect, useMemo, useState } from "react";
import { useParent, useParentPagination } from "../hooks";
import { useNavigate } from "react-router-dom";
import { lang } from "@/core/libs";
import { ModalCreateParents } from "../components/ModalCreateParents";
import { useProfile } from "@/features/profile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { Download, UploadCloud } from "lucide-react";
import { UploadScheduleDialog } from "@/features/schedules/components/UploadScheduleDialog";
import { uploadExcelService } from "@/core/services/excel";
export function ParentTable() {
  const alert = useAlert();

  const {
    global,
    setGlobal,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
    defaultSorting: [
      {
        id: "updatedAt",
        desc: true,
      },
    ],
  });

  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
    sortBy: sorting?.[0]?.id,
    sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
  }
  // const parent = useParent();

  const parent = useParentPagination(params);
  const navigate = useNavigate();
  const school = useSchool();
  const userDelete = useUserCreation();

  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (parent: any) => {
    setSelectedParent(parent);
    setOpenDeleteDialog(true);
  };

  const columns = useMemo(() => {
    return parentColumnWithFilter({
      columnFilter: {
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      },
      onDelete: handleOpenDeleteDialog,
    });
  }, [school.data]);



  const [parents, setParents] = useState(false);

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  async function handleDelete() {
    try {
      await userDelete.deleteUser(Number(selectedParent?.id));
      alert.success(lang.text("successDelete"));
      parent.query.refetch();
      setOpenDeleteDialog(false);
      setSelectedParent(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://docs.google.com/spreadsheets/d/1szWeOeeAxNlg0SF5FKoGH1ekHDa5amYT/export?format=xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert.success(lang.text("successDownloadTemplateExcel", {
        context: lang.text("parent"),
      }));
    } catch (err: any) {
      alert.error(
        lang.text("failedDownloadTemplateExcel", {
          context: lang.text("parent"),
        })
      );
    }
  };

  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error(lang.text("selectExcelFirst"));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "orangTua");

      await uploadExcelService.importExcel(formData);

      alert.success(lang.text("successImportData", {
        context: lang.text("parent"),
      }));

      await parent.query.refetch();

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(err?.message ?? lang.text("failedImportData", { context: lang.text("parent") }));
    }
  };

  return (
    <>
      {
        <ModalCreateParents
          show={parents}
          onClose={() => setParents(!parents)}
        />
      }
      <BaseDataTable
        columns={columns}
        data={parent.data || []}
        dataFallback={columns}
        globalSearch
        onGlobalFilterChange={setGlobal}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={parent.pagination?.total ?? 0}
        sorting={sorting}
        onSortingChange={onSortingChange}
        actions={[
          ...(!isRole
            ? [
              {
                title: lang.text("downloadTemplateExcel"),
                icon: <Download />,
                onClick: handleDownloadTemplate,
                variant: "default" as const,
                className: "bg-green-500 text-white hover:bg-green-600",
              },

              {
                title: lang.text("uploadExcel"),
                icon: <UploadCloud />,
                onClick: () => setIsUploadModalOpen(true),
                variant: "outline" as const,
                className:
                  "border-green-500 text-green-500 hover:bg-green-50",
              },
              {
                title: lang.text("createParent"),
                icon: <FaPlus />,
                onClick: () => navigate("/parents/create"),
              },
            ]
            : []),
        ]}
        searchParamPagination
        showFilterButton
        searchPlaceholder={lang.text("search") + " " + lang.text("parent")}
        isLoading={
          parent.query.isLoading
        }
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
            {lang.text("deleteMessage", {
              context: selectedParent?.name,
            })}
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
            disabled={userDelete.isLoading}
            variant="contained"
            color="primary"
          >
            {lang.text("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      
    </>
  );
}
