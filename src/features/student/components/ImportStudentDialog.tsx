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
import { UploadIcon } from "lucide-react";

interface ImportStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

export const ImportStudentDialog = ({
  open,
  onOpenChange,
  selectedFile,
  isUploading,
  onFileChange,
  onImport,
}: ImportStudentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lang.text("import")} Data Siswa</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-gray-300 transition"
          >
            <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-600 text-sm">
              {selectedFile ? selectedFile.name : "Pilih file CSV atau Excel"}
            </span>
          </label>

          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        <DialogFooter className="flex justify-between space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lang.text("cancel")}
          </Button>

          <Button
            variant="default"
            disabled={!selectedFile || isUploading}
            onClick={onImport}
          >
            {isUploading ? "Uploading..." : lang.text("import")} Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
