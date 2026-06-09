import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { userService } from "@/core/services";
import { getStaticFile } from "@/core/utils";
import { useProfile } from "@/features/profile";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, To } from "react-router-dom";
import { QrAttendanceDialog } from "./components/QrAttendanceDialog";
import { useAlert } from "@/features/_global/hooks";
import { useStudents } from "./components/useStudents";
import { FaceRegisterUploader } from "./components/FaceRegisterUploader";

export interface UserMenuItem {
  title?: string;
  separator?: boolean;
  label?: boolean;
  url?: To;
}

export interface UserMenuProps {
  menus: UserMenuItem[];
}

export const UserMenu = React.memo(({ menus = [] }: UserMenuProps) => {
  const profile = useProfile();
  const isRoleSiswa = profile?.user?.role === "siswa";
  const isRoleTeacher = profile?.user?.role === "guru";
  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";
  const [open, setOpen] = useState(false);
  const alert = useAlert();
  const [openDialogRegister, setOpenDialogRegister] = useState(false);
  const [fotoTampakDepan, setFotoTampakDepan] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loadingRegisterFace, setLoadingRegisterFace] = useState(false);

  const [qrValue, setQrValue] = useState("");
  const [expiry, setExpiry] = useState(0);

  const generateQrCode = async () => {
    try {
      const res = await userService.generateQrRfid();

      const qrCode = res?.data.qrCode;
      const expiry = res?.data.expiresIn;

      setQrValue(qrCode || "");
      setExpiry(expiry || 0);
      setOpen(true);
    } catch (err: any) {
      console.error("Failed generate QR", err);

      const message = "Kartu RFID tidak ditemukan";

      alert.error(message);
    }
  };

  const downloadQrCode = () => {
    const base64 = qrValue;

    if (!base64) return;

    const img = new Image();

    img.onload = () => {
      const scale = 5; // 🔥 makin besar makin HD

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // biar tetap tajam
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngFile;
      link.download = "attendance-qr.png";
      link.click();
    };

    img.src = base64.startsWith("data:")
      ? base64
      : `data:image/png;base64,${base64}`;
  };

  const handleRegisterFace = async () => {
    try {
      if (!fotoTampakDepan) {
        alert.error("Foto tampak depan wajib diisi");
        return;
      }

      setLoadingRegisterFace(true);
      const userIdToSend = isAdmin ? selectedStudent : profile?.user?.id;

      const formData = new FormData();

      formData.append("fotoTampakDepan", fotoTampakDepan);
      formData.append("userId", String(userIdToSend));

      if (!isRoleTeacher) {
        await userService.registerFace(formData);
      } else {
        await userService.registerFaceTeacher(formData);
      }

      alert.success(lang.text("successRegister"));

      setOpenDialogRegister(false);
      setFotoTampakDepan(null);
      setPreviewImage("");
    } catch (error: any) {
      alert.error(error?.message);
    } finally {
      setLoadingRegisterFace(false);
    }
  };

  const fileRef = React.useRef<HTMLInputElement>(null);
  // const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const { data: students } = useStudents();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="border-2 border-foreground/25">
              <AvatarImage
                src={getStaticFile(String(profile.user?.image))}
                alt={profile.user?.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        {menus && menus?.length > 0 && (
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-row gap-2">
                <Avatar>
                  <AvatarImage
                    src={getStaticFile(String(profile.user?.image))}
                    alt={profile.user?.name}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap flex-1">
                  <p className="font-bold">{profile.user?.name || "-"}</p>
                  <p className="text-xs opacity-50">
                    {profile.user?.email || "-"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuLabel
                style={{ fontWeight: "normal", cursor: "pointer" }}
                onClick={() => setOpenDialogRegister(true)}
              >
                {lang.text("RegisterFace")}
              </DropdownMenuLabel>
            )}
            {isRoleTeacher && (
              <>
                <DropdownMenuLabel
                  style={{ fontWeight: "normal", cursor: "pointer" }}
                  onClick={() => setOpenDialogRegister(true)}
                >
                  {lang.text("RegisterFace")}
                </DropdownMenuLabel>
                <DropdownMenuLabel
                  style={{ fontWeight: "normal", cursor: "pointer" }}
                  onClick={generateQrCode}
                >
                  {lang.text("generateQr")}
                </DropdownMenuLabel>
              </>
            )}
            {isRoleSiswa && (
              <>
                <DropdownMenuLabel
                  style={{ fontWeight: "normal", cursor: "pointer" }}
                  onClick={() => setOpenDialogRegister(true)}
                >
                  {lang.text("RegisterFace")}
                </DropdownMenuLabel>
                <DropdownMenuLabel
                  style={{ fontWeight: "normal", cursor: "pointer" }}
                  onClick={generateQrCode}
                >
                  {lang.text("generateQr")}
                </DropdownMenuLabel>
              </>
            )}

            {menus?.map((menu, i) => {
              if (menu.separator) {
                return <DropdownMenuSeparator key={i} />;
              }

              if (menu.label) {
                return (
                  <DropdownMenuLabel key={i}>{menu.title}</DropdownMenuLabel>
                );
              }
              return (
                <DropdownMenuItem asChild key={i}>
                  <Link to={menu.url || "#"}>{menu.title}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <QrAttendanceDialog
        open={open}
        onClose={() => setOpen(false)}
        qrValue={qrValue}
        expiry={expiry}
        onDownload={downloadQrCode}
      />
      <Dialog
        open={openDialogRegister}
        onClose={() => setOpenDialogRegister(false)}
        fullWidth
        maxWidth="sm"
        disableAutoFocus
        disableEnforceFocus
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {lang.text("RegisterFace")}
          <IconButton
            onClick={() => {
              setOpenDialogRegister(false);
              setFotoTampakDepan(null);
              setPreviewImage("");
            }}
          >
            <XIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            {isAdmin && (
              <Box sx={{ mb: 2 }}>
                <>
                  <label className="text-black text-md font-semibold mb-2 flex items-center gap-2 mb-2">
                    Siswa
                  </label>
                  <Select
                    fullWidth
                    size="small"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    {students?.map((student: any) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              </Box>
            )}
            <FaceRegisterUploader
              file={fotoTampakDepan}
              onFileChange={(file) => {
                setFotoTampakDepan(file);

                if (file) {
                  setPreviewImage(URL.createObjectURL(file));
                } else {
                  setPreviewImage("");
                }
              }}
              onRegister={handleRegisterFace}
              loading={loadingRegisterFace}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});
