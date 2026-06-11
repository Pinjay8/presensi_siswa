import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { Divider, Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useScheduler } from "../hooks/use-scheduler";
import { useAlert } from "@/features/_global";

interface modalAssignScheduleProps {
  open: boolean;
  onClose: () => void;
  selectedTeacher: any;
}


export default function ModalAssignSchedule({
  open,
  onClose,
  selectedTeacher,
}: modalAssignScheduleProps) {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const scheduler = useScheduler();

  const data = scheduler.data || [];

  const options = data.filter((s) => s.type === "GURU").map((option) => ({
    label: option.name,
    value: option.id,
  }));

  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  async function handleSubmit() {
    if (!selectedSchedule) return;
    setLoading(true);
    try {
      await scheduler.assign({
        guru_id: Number(selectedTeacher.id),
        id: Number(selectedSchedule.value),
      });
      alert.success("Assign schedule berhasil");
    } catch (error: any) {
      alert.error(error?.message);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  const handleClose = () => {
    setSelectedSchedule(null);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{lang.text("assignSchedule")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">{lang.text("teacher")}</label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
              {selectedTeacher?.user?.name || "-"}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">{lang.text("scheduler")} *</label>
            <Autocomplete
              disablePortal
              options={options}
              getOptionLabel={(option) => option.label || ""}
              value={selectedSchedule}
              loading={scheduler.isLoading}
              onChange={(event, newValue) => {
                setSelectedSchedule(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Pilih Jadwal..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      borderRadius: "12px",
                      fontSize: "14px",
                    }
                  }}
                />
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            {lang.text("cancel") || "Batal"}
          </Button>
          <Button
            variant="default"
            disabled={!selectedSchedule || loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : (lang.text("saveChanges") || "Simpan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
