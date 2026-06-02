import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { SchoolUpdateForm } from "./school-update-form";
import { useSchoolUpdateDialog } from "../hooks";
import { Divider } from "@mui/material";

export const SchoolUpdateDialog = () => {
  const { isModalOpen, handleOpenChange, handleCloseDialog } =
    useSchoolUpdateDialog();

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="min-w-[70vw] h-max">
        <DialogHeader className="flex justify-between border-b border-b-white/10">
          <DialogTitle className="flex items-baseline">
            <p>Lengkapi data sekolah</p>
          </DialogTitle>
          <Divider />
        </DialogHeader>
        <SchoolUpdateForm onClose={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};
