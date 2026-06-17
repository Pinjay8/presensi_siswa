import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  lang,
} from "@/core/libs";
import { Divider } from "@mui/material";

type DayFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  daysOrder: string[];
  selectedDays: string[];

  handleAllDaysToggle: () => void;
  handleDayToggle: (day: string) => void;
};

export function DayFilterDialog({
  open,
  onOpenChange,
  daysOrder,
  selectedDays,
  handleAllDaysToggle,
  handleDayToggle,
}: DayFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader style={{ marginTop: "15px" }}>
          <DialogTitle>{lang.text("selectDays")}</DialogTitle>
        </DialogHeader>
        <Divider />
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="all-days"
              checked={selectedDays.length === daysOrder.length}
              onCheckedChange={handleAllDaysToggle}
            />
            <label htmlFor="all-days">Semua Hari</label>
          </div>

          {daysOrder.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <Checkbox
                id={day}
                checked={selectedDays.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
              />
              <label htmlFor={day}>{day}</label>
            </div>
          ))}
        </div>

        {/* <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
