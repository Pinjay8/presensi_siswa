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
  Typography,
} from "@mui/material";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Link, To } from "react-router-dom";
import { QrAttendanceDialog } from "./components/QrAttendanceDialog";
import { useAlert } from "@/features/_global/hooks";
import { studentService } from "@/core/services/pagination";
import { useStudents } from "./components/useStudents";
import { FileUploader } from "../../file-uploader";

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

  const [qrValue, setQrValue] = useState("");
  const [expiry, setExpiry] = useState(0);

  const generateQrCode = async () => {
    try {
      const res = await userService.generateQr();

      const qrCode = res?.token;
      const expiry = res?.expiresIn;

      setQrValue(qrCode || "");
      setExpiry(expiry || 0);
      setOpen(true);
    } catch (error) {
      console.error("Failed generate QR", error);
    }
  };

  const downloadQrCode = () => {
    const svg = document.getElementById("attendance-qr");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = 500;
      canvas.height = 500;

      ctx?.drawImage(img, 0, 0, 500, 500);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "attendance-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const [openDialogRegister, setOpenDialogRegister] = useState(false);
  const [fotoTampakDepan, setFotoTampakDepan] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loadingRegisterFace, setLoadingRegisterFace] = useState(false);

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
                  onClick={generateQrCode}
                >
                  {lang.text("generateQr")}
                </DropdownMenuLabel>
                <DropdownMenuLabel
                  style={{ fontWeight: "normal", cursor: "pointer" }}
                  onClick={() => setOpenDialogRegister(true)}
                >
                  {lang.text("RegisterFace")}
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
        onClose={setOpenDialogRegister}
        fullWidth
        maxWidth="sm"
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
                    {students.map((student: any) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              </Box>
            )}
            <div className="flex flex-col">
              <label className="text-black text-md font-semibold mb-0 flex items-center gap-2 mb-2">
                {lang.text("UploadPicture")}
              </label>
              <div className="relative">
                {/* <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFotoTampakDepan(file);

                    if (file) setPreviewImage(URL.createObjectURL(file));
                  }}
                /> */}
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
                  // onError={(message) => {
                  //   // showSwal("error", message);
                  //   alert.error(message);
                  // }}
                  maxSize={1 * 1024 * 1024}
                />

                <Box mt={2}>
                  {/* <Button
                    onClick={() => fileRef.current?.click()}
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    {lang.text("ChoosePicture")}
                  </Button> */}
                  {/* {previewImage && (
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
                  )} */}

                  <Button
                    onClick={handleRegisterFace}
                    // disabled={loadingRegisterFace}
                    style={{ width: "100%" }}
                    disabled={!fotoTampakDepan}
                  >
                    {lang.text("RegisterFace")}
                  </Button>
                </Box>
              </div>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});
