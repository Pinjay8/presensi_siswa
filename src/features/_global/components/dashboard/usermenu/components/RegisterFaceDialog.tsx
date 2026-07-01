import React, { useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { XIcon } from "lucide-react";
import { Button, lang } from "@/core/libs";
import { FileUploader } from "../../../file-uploader";
import { useAlert } from "@/features/_global/hooks";

interface RegisterFaceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
}

export default function RegisterFaceDialog({
  open,
  onClose,
  onSubmit,
}: RegisterFaceDialogProps) {
  const [fotoTampakDepan, setFotoTampakDepan] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const handleSubmit = async () => {
    if (!fotoTampakDepan) {
      alert.error(lang.text("photoRequired"));
      return;
    }

    try {
      setLoading(true);
      await onSubmit(fotoTampakDepan);

      setFotoTampakDepan(null);
      setPreviewImage("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFotoTampakDepan(null);
    setPreviewImage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {lang.text("RegisterFace")}

        <IconButton onClick={handleClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className="flex flex-col">
          <label className="text-black text-md font-semibold mb-2">
            {lang.text("UploadPicture")}
          </label>

          <FileUploader
            value={fotoTampakDepan || undefined}
            buttonPlaceholder={lang.text("ChoosePicture")}
            onChange={(file) => {
              setFotoTampakDepan(file);

              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage("");
              }
            }}
            maxSize={1 * 1024 * 1024}
          />

          <Box mt={2}>
            <Button
              onClick={handleSubmit}
              disabled={!fotoTampakDepan || loading}
              style={{ width: "100%" }}
            >
              {lang.text("RegisterFace")}
            </Button>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
}
