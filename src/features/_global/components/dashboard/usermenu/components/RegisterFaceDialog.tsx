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

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!fotoTampakDepan) return;

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

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;

              setFotoTampakDepan(file);

              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />

          <Box mt={2}>
            <Button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            >
              {lang.text("ChoosePicture")}
            </Button>

            {previewImage && (
              <Box mb={2}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}

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
