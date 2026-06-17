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
