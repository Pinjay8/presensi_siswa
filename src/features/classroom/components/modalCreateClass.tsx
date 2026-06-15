import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { ClassroomCreationForm } from "../containers";
import { Divider } from "@mui/material";

interface propsModal {
  show: boolean;
  onClose: () => void;
}

export const ModalCreateClass = ({ show, onClose }: propsModal) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-max pt-3.5 h-max">
        <DialogHeader className="flex] justify-between border-b border-b-white/10">
          <DialogTitle className="flex items-baseline mt-6">
            <p>{lang.text("completeDataClassroom")}</p>
          </DialogTitle>
        </DialogHeader>
        <Divider />
        <ClassroomCreationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
