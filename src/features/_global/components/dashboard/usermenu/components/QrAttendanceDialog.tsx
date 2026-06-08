import React from "react";
import QRCode from "react-qr-code";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { XIcon } from "lucide-react";
import { Button } from "@/core/libs";

interface QrAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  qrValue: string;
  expiry: number;
  onDownload: () => void;
}

export const QrAttendanceDialog = ({
  open,
  onClose,
  qrValue,
  expiry,
  onDownload,
}: QrAttendanceDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Qr Access Attendance
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <QRCode value={qrValue} id="attendance-qr" />

          <Box
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            QR Code ini berlaku selama <strong>{expiry} menit</strong>. Setelah
            masa berlaku habis, silakan generate ulang QR Code.
          </Box>

          <Button variant="default" onClick={onDownload}>
            Download QR
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
