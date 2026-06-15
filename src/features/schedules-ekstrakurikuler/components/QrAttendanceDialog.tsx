import { useRef } from "react";
import { Button, CircularProgress, Divider } from "@mui/material";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/libs";
import QRCode from "react-qr-code";

interface QrAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode?: string;
  selectedQr?: {
    namaKelas?: string;
    namaMapel?: string;
  } | null;
}

export function QrAttendanceDialog({
  open,
  onOpenChange,
  qrCode,
  selectedQr,
}: QrAttendanceDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 600;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const padding = 30;

      ctx.drawImage(
        img,
        padding,
        padding,
        size - padding * 2,
        size - padding * 2,
      );

      URL.revokeObjectURL(url);

      const png = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = png;
      link.download = `qr-presensi-${selectedQr?.namaKelas ?? "kelas"}.png`;
      link.click();
    };

    img.src = url;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ marginTop: "20px", marginBottom: '10px' }}>
            QR Code Presensi Mata Pelajaran
          </DialogTitle>
        </DialogHeader>

        <Divider />

        <div className="space-y-4">
          <div>
            <p>
              <b>Kelas :</b> {selectedQr?.namaKelas}
            </p>

            <p>
              <b>Mata Pelajaran :</b> {selectedQr?.namaMapel}
            </p>
          </div>

          <Divider />

          <div className="flex flex-col items-center">
            {qrCode ? (
              <>
                <div ref={qrRef}>
                  <QRCode value={qrCode} size={300} />
                </div>

                <Button
                  sx={{ mt: 4 }}
                  onClick={handleDownloadQr}
                  // variant="default"
                  variant="contained"
                >
                  Download QR
                </Button>
              </>
            ) : (
              <CircularProgress />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
