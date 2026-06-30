import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable, useAlert } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { useProfile } from "@/features/profile";
import { useCards } from "../hooks/useCards";
import { cardColumns, cardSFallback } from "../utils/table-column";
import { ModalCreateCards } from "../components/modalCreateClass";
import { CardsForm } from "./CardsForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { Divider } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { DeleteCardDialog, DeleteDialog } from "../components/DeleteCardDialog";
import { useUserCreation } from "@/features/user";
import { cardsService } from "@/core/services/cards";
import { UploadScheduleDialog } from "@/features/schedules/components/UploadScheduleDialog";
import { uploadExcelService } from "@/core/services/excel";
import { Download, UploadCloud } from "lucide-react";

export const CardViewTable = () => {
  //   const resource = useClassroom();
  const resource = useCards();
  const [cards, setCards] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const userDelete = useUserCreation();
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const alert = useAlert();

  const handleOpenDeleteDialog = (parent: any) => {
    setSelectedCard(parent);
    setOpenDelete(true);
  };
  const columns = useMemo(
    () =>
      cardColumns(
        {},
        (id) => {
          setSelectedId(id);
          setOpenEdit(true);
        },
        handleOpenDeleteDialog,
      ),
    [resource.data],
  );

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  async function handleDelete() {
    try {
      // await userDelete.deleteUser(Number(selectedCard?.id));
      await cardsService.delete(Number(selectedCard.id));
      alert.success(lang.text("successDelete"));
      // biodata.query.refetch();
      resource.query.refetch();
      setOpenDelete(false);
      setSelectedCard(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://docs.google.com/spreadsheets/d/1NHf-NHTRAyq2f-Pky7YD-TjPKM6jkb-H/export?format=xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert.success("Template Excel berhasil diunduh");
    } catch (err: any) {
      alert.error(
        "Gagal mengunduh template Excel: " + (err.message || "Unknown error"),
      );
    }
  };

  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error("Pilih file Excel terlebih dahulu");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "kartu");

      await uploadExcelService.importExcel(formData);

      alert.success("Import data kartu berhasil");

      await resource.query.refetch();

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(err?.message ?? "Gagal mengunggah file Excel");
    }
  };

  return (
    <>
      {!isRole && (
        <ModalCreateCards show={cards} onClose={() => setCards(!cards)} />
      )}
      <BaseDataTable
        columns={columns}
        data={resource.data}
        dataFallback={[]}
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
                  title: lang.text("addCards"),
                  icon: <FaPlus />,
                  onClick: () => setCards(!cards),
                },
              ]
            : []),
        ]}
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
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
      <Dialog open={openEdit} onOpenChange={() => setOpenEdit(false)}>
        <DialogContent className=" pt-3.5 h-max w-[500px]">
          <DialogHeader className="flex justify-between border-b border-b-white/10 mt-2">
            <DialogTitle className="flex items-baseline">
              <p>{lang.text("editCards")}</p>
            </DialogTitle>
          </DialogHeader>

          <Divider />

          <CardsForm
            cardId={selectedId || undefined}
            onClose={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={userDelete.isLoading}
      />
    </>
  );
};
