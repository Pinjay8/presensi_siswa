import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { CourseCreationForm } from "../containers";
import { Divider } from "@mui/material";

interface propsModal {
  show: boolean;
  onClose: () => void;
}

export const ModalCreateCourse = ({ show, onClose }: propsModal) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-max pt-10 h-max">
        <DialogHeader className="flex h-[25px] justify-between border-b border-b-white/10 pb-0 mb-0">
          <DialogTitle className="flex items-baseline">
            <p>{lang.text("completeDataCourse")}</p>
          </DialogTitle>
        </DialogHeader>
        <Divider />
        <CourseCreationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
