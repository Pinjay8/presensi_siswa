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
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
        px={0}
      >
        <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                mb={1}
              >
                Scan QR-Code
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mb={3}
              >
                Arahkan kamera ke QR Code untuk melakukan absensi
              </Typography>

              <Box
                ref={scanContainerRef}
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 500,
                  mx: "auto",
                  aspectRatio: "1 / 1",
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "#000",
                  boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                }}
              >
                <Html5QrScanner
                  active={open}
                  facingMode={facingMode}
                  onScan={handleSubmitQr}
                  onError={(e) => console.error(e)}
                />

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 230,
                        sm: 260,
                        md: 300,
                        xl: 340,
                      },
                      height: {
                        xs: 200,
                        sm: 220,
                        md: 260,
                        xl: 310,
                      },
                      position: "relative",
                      borderRadius: 3,
                      boxShadow: "0 0 0 9999px rgba(0,0,0,.55)",
                    }}
                  >
                    {["tl", "tr", "bl", "br"].map((c) => (
                      <Box
                        key={c}
                        sx={{
                          position: "absolute",
                          width: 40,
                          height: 40,
                          border: "4px solid #00E5FF",

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
                        left: 10,
                        right: 10,
                        height: 3,
                        background:
                          "linear-gradient(90deg, transparent, #00E5FF, transparent)",

                        animation: "scanLine 2s linear infinite",

                        "@keyframes scanLine": {
                          "0%": {
                            top: 0,
                          },
                          "100%": {
                            top: "calc(100% - 3px)",
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Controls */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() =>
                      setFacingMode((f) =>
                        f === "environment" ? "user" : "environment",
                      )
                    }
                    startIcon={<Camera />}
                  >
                    Flip
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => setTorchOn((v) => !v)}
                    startIcon={torchOn ? <Flashlight /> : <FlashlightOff />}
                  >
                    Torch
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
