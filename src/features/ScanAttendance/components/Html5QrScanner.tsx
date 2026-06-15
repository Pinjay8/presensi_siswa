import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

type Html5QrScannerProps = {
  active: boolean;
  facingMode: "user" | "environment";
  onScan: (value: string) => Promise<void>;
  onError?: (err: any) => void;
};

export const Html5QrScanner = ({
  active,
  facingMode,
  onScan,
  onError,
}: Html5QrScannerProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<Html5Qrcode | null>(null);
  const scanning = useRef(false);
  const isRunning = useRef(false);

  useEffect(() => {
    if (!active || !qrRef.current) return;

    const id = "html5-qr-reader";
    qrRef.current.id = id;

    const qr = new Html5Qrcode(id);
    qrInstance.current = qr;

    qr.start(
      { facingMode },
      {
        fps: 10,
        qrbox: { width: 350, height: 250 },
        disableFlip: true,
      },
      async (decodedText) => {
        if (scanning.current) return;
        scanning.current = true;

        try {
          await onScan(decodedText);
        } finally {
          scanning.current = false;
        }
      },
      () => {},
    )
      .then(() => {
        isRunning.current = true;
      })
      .catch((err) => {
        console.error("QR start error:", err);
      });

    return () => {
      scanning.current = false;

      const qr = qrInstance.current;

      if (!qr || !isRunning.current) return;

      isRunning.current = false;

      qr.stop()
        .then(() => qr.clear())
        .catch((err) => {
          // ignore "not running or paused"
          if (!String(err).includes("not running")) {
            console.warn("QR stop error:", err);
          }
        });
    };
  }, [active, facingMode]);

  return (
    <div
      ref={qrRef}
      style={{
        width: "100%",
        height: "100%",
        // background: 'black',
      }}
    />
  );
};
