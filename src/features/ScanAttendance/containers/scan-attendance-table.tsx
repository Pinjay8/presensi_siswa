import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable, useAlert } from "@/features/_global";
import { CardTitle, distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useEffect, useMemo, useRef, useState } from "react";
// import { teacherColumnWithFilter } from "../utils";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/features/profile";
import { useClassroom } from "@/features/classroom";
import { teacherService } from "@/core/services/teacher";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Html5QrScanner } from "../components/Html5QrScanner";
import { Camera, Flashlight, FlashlightOff } from "lucide-react";
import { userService } from "@/core/services";

export function ScanAttendanceTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(false);
  const [openWaliKelas, setOpenWaliKelas] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const kelas = useClassroom();
  const alert = useAlert();
  const columns = useMemo(
    () => {},
    //   teacherColumnWithFilter({
    //     schoolOptions: distinctObjectsByProperty(
    //       school.data?.map((d) => ({
    //         label: d.namaSekolah,
    //         value: d.namaSekolah,
    //       })) || [],
    //       "value",
    //     ),

    //     onWaliKelas: (teacher: any) => {
    //       setSelectedTeacher(teacher);
    //       setOpenWaliKelas(true);
    //     },
    //   }),
    [],
  );

  const profile = useProfile();
  const isTeacher = profile?.user?.role === "guru";

  const scanContainerRef = useRef<HTMLDivElement>(null);
  const [hasDecoded, setHasDecoded] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [open, setOpen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  //   const alert = useAlert();

  const absenQrMutation = useMutation({
    mutationFn: async (qrCodeData: string) => {
      return await userService.absenQr({
        qrCodeData,
      });
    },
    onSuccess: (res) => {
      alert.success(res?.message || "Absensi berhasil direkam");
    },

    onError: (error: any) => {
      alert.error(error?.response?.data?.message || "Gagal melakukan absensi");
    },
  });

  const handleSubmitQr = async (value: string) => {
    if (absenQrMutation.isPending) return;

    try {
      setQrValue(value);

      await absenQrMutation.mutateAsync(value);

      // supaya scanner tidak spam
      setOpen(false);

      setTimeout(() => {
        setOpen(true);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100%"}
      >
        <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
          <Box
            ref={scanContainerRef}
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "black",
              aspectRatio: "3 / 2.5",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              }}
            >
              <Html5QrScanner
                active={open}
                facingMode={facingMode}
                onScan={handleSubmitQr}
                onError={(e) => console.error("QR error", e)}
              />
            </Box>

            {/* OVERLAY */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: 330, lg: 285 },
                  height: { xs: 240, sm: 320 },
                  position: "relative",
                  borderRadius: 2,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                  outline: "2px solid rgba(255,255,255,0.18)",
                }}
              >
                {["tl", "tr", "bl", "br"].map((c) => (
                  <Box
                    key={c}
                    sx={{
                      position: "absolute",
                      width: 50,
                      height: 50,
                      border: "3px solid #00e5ff",
                      ...(c === "tl" && {
                        top: 0,
                        left: 0,
                        borderRight: "none",
                        borderBottom: "none",
                      }),
                      ...(c === "tr" && {
                        top: 0,
                        right: 0,
                        borderLeft: "none",
                        borderBottom: "none",
                      }),
                      ...(c === "bl" && {
                        bottom: 0,
                        left: 0,
                        borderRight: "none",
                        borderTop: "none",
                      }),
                      ...(c === "br" && {
                        bottom: 0,
                        right: 0,
                        borderLeft: "none",
                        borderTop: "none",
                      }),
                    }}
                  />
                ))}

                <Box
                  sx={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #00e5ff, transparent)",
                    animation: "scanLine 2s linear infinite",
                    "@keyframes scanLine": {
                      "0%": { top: 0 },
                      "100%": { top: "calc(100% - 2px)" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* CONTROLS */}
            <Box
              sx={{
                position: "absolute",
                bottom: 5,
                left: 0,
                right: 0,
                zIndex: 3,
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <Button
                onClick={() =>
                  setFacingMode((f) =>
                    f === "environment" ? "user" : "environment",
                  )
                }
                variant="contained"
                size="small"
                // sx={{ bgcolor: 'rgba(0,0,0,0.6)' }}
                startIcon={<Camera fontSize="small" />}
              >
                Flip
              </Button>

              <Button
                onClick={async () => {
                  try {
                    const video =
                      scanContainerRef.current?.querySelector("video");
                    const stream = video?.srcObject as MediaStream | null;
                    const track = stream?.getVideoTracks()?.[0];
                    const caps = track?.getCapabilities?.() as any;
                    if (track && caps?.torch) {
                      await track.applyConstraints({
                        advanced: [{ torch: !torchOn }] as any,
                      });
                      setTorchOn((t) => !t);
                    }
                  } catch (e) {
                    console.log("Torch toggle error:", e);
                  }
                }}
                variant="contained"
                size="small"
                sx={{ bgcolor: "rgba(0,0,0,0.6)" }}
                startIcon={torchOn ? <Flashlight /> : <FlashlightOff />}
              >
                Torch
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="h5"
              textAlign={"center"}
              mt={2}
              fontWeight={"bold"}
            >
              Scan QR-Code Anda
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
