import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { Divider } from "@mui/material";
import { CardsForm } from "../containers/CardsForm";

interface propsModal {
  show: boolean;
  onClose: () => void;
}

export const ModalCreateCards = ({ show, onClose }: propsModal) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-[500px] pt-3.5 h-max">
        <DialogHeader className="flex justify-between border-b border-b-white/10 mt-2">
          <DialogTitle className="flex items-baseline mt-4">
            <p>{lang.text("addCards")}</p>
          </DialogTitle>
        </DialogHeader>
        <Divider />
        <CardsForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
