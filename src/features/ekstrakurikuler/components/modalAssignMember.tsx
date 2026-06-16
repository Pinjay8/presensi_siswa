import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";

import { DialogActions, Divider, Typography } from "@mui/material";

import { useStudents } from "@/features/_global/components/dashboard/usermenu/components/useStudents";
import { useState } from "react";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useAlert } from "@/features/_global";

interface propsModal {
  show: boolean;
  onClose: () => void;
  ekstrakurikulerId?: any;
  onSuccess?: any;
}

export const ModalAssignMember = ({
  show,
  onClose,
  ekstrakurikulerId,
  onSuccess,
}: propsModal) => {
  const students = useStudents();

  const [selectedStudent, setSelectedStudent] = useState("");

  const alert = useAlert();

  const handleSubmit = async () => {
    try {
      if (!selectedStudent) {
        alert.error(lang.text("selectStudent"));
        return;
      }

      await ekstrakurikulerService.assignMember(ekstrakurikulerId, {
        biodataSiswaId: Number(selectedStudent),
      });

      alert.success(
        lang.text("successAssign", {
          context: lang.text("student"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Assign member error:", error);

      alert.error(
        error?.response?.data?.message ||
          error?.message ||
          lang.text("failAssign", {
            context: lang.text("student"),
          }),
      );
    }
  };
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="pt-10 h-max w-[500px]">
        <DialogHeader className="flex h-[25px] justify-between border-b border-b-white/10 pb-0 mb-0">
          <DialogTitle className="flex items-baseline">
            <p>{lang.text("selectStudent")}</p>
          </DialogTitle>
        </DialogHeader>
        <Divider />
        <Typography>{lang.text("student")}</Typography>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger>
            <SelectValue placeholder={lang.text("selectStudent")} />
          </SelectTrigger>

          {/* <SelectContent>
            {students.data?.map((student: any) => (
              <SelectItem key={student.id} value={String(student.id)}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent> */}
          <SelectContent>
            {students.data?.map((student: any) => {
              const biodata = student.biodataSiswa?.[0];

              if (!biodata) return null;

              return (
                <SelectItem key={biodata.id} value={String(biodata.id)}>
                  {student.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <DialogActions>
          <Button onClick={handleSubmit}>{lang.text("save")}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
