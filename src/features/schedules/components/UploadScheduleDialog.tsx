import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/core/libs";

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
          <DialogTitle>Unggah Jadwal dari Excel</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="excelFile">Pilih File Excel</label>

            <Input
              id="excelFile"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUploadExcel}>Unggah</Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
