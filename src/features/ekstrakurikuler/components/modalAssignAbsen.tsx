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
import { useGetAllEkstrakurikuler } from "../hooks/useGetAllEkestrakurikuler";
import { useMemberEkstrakurikulerDetail } from "../hooks/useMemberEkstrakurikuler";

interface propsModal {
  show: boolean;
  onClose: () => void;
  ekstrakurikulerId?: any;
  onSuccess?: any;
}

export const ModalAssignAbsen = ({
  show,
  onClose,
  ekstrakurikulerId,
  onSuccess,
}: propsModal) => {
  const students = useMemberEkstrakurikulerDetail({
    id: ekstrakurikulerId,
  });

  const [selectedStudent, setSelectedStudent] = useState("");
  const [statusKehadiran, setStatusKehadiran] = useState("hadir");

  const alert = useAlert();

  const handleSubmit = async () => {
    try {
      if (!selectedStudent) {
        alert.error(lang.text("selectStudent"));
        return;
      }

      await ekstrakurikulerService.createAbsensi(ekstrakurikulerId, {
        anggotaEkskulId: Number(selectedStudent),
        statusKehadiran,
      });

      alert.success(
        lang.text("successCreate", {
          context: lang.text("absensi"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error(error);

      alert.error(
        error?.response?.data?.message ||
          error?.message ||
          lang.text("failed", {
            context: lang.text("absensi"),
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

          <SelectContent>
            {students.data?.map((student: any) => (
              <SelectItem key={student.id} value={String(student.id)}>
                {student.biodataSiswa?.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Typography>Status Kehadiran</Typography>

        <Select value={statusKehadiran} onValueChange={setStatusKehadiran}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="hadir">Hadir</SelectItem>
            <SelectItem value="izin">Izin</SelectItem>
            <SelectItem value="sakit">Sakit</SelectItem>
            <SelectItem value="alpa">Alpa</SelectItem>
          </SelectContent>
        </Select>
        <DialogActions>
          <Button onClick={handleSubmit}>{lang.text("save")}</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
