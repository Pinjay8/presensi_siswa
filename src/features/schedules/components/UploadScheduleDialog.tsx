import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
} from "@/core/libs";
import { Divider } from "@mui/material";

type UploadScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  setExcelFile: (file: File | null) => void;
  handleUploadExcel: () => void;
};

export function UploadScheduleDialog({
  open,
  onOpenChange,
  setExcelFile,
  handleUploadExcel,
}: UploadScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ marginTop: "18px", textAlign: "start" }}>
            {lang.text("uploadExcelFromFile")}
          </DialogTitle>
        </DialogHeader>
        <Divider />

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label
              htmlFor="excelFile"
              style={{ marginBottom: "10px", fontWeight: "semibold" }}
            >
              {lang.text("selectExcelFile")}
            </label>
            <Input
              id="excelFile"
              type="file"
              style={{ cursor: "pointer", height: "40px" }}
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <DialogFooter style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={handleUploadExcel}>{lang.text("upload")}</Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lang.text("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
