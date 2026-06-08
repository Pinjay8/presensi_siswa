import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
import { useProfile } from "@/features/profile";
import { useCards } from "../hooks/useCards";
import { cardColumns, cardSFallback } from "../utils/table-column";
import { ModalCreateCards } from "../components/modalCreateClass";
import { CardsForm } from "./CardsForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { Divider } from "@mui/material";

export const CardViewTable = () => {
  //   const resource = useClassroom();
  const resource = useCards();
  const [cards, setCards] = useState(false);
  const columns = useMemo(
    () =>
      cardColumns({}, (id) => {
        setSelectedId(id);
        setOpenEdit(true);
      }),
    [resource.data],
  );
  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
    </>
  );
};
