import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { useProfile } from "@/features/profile";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { userService } from "@/core/services";
import { useAlert } from "../hooks";
import { XIcon } from "lucide-react";
import { studentService } from "@/core/services/pagination";

export interface BaseActionTableProps {
  editPath?: string;
  deletePath?: string;
  detailPath?: string;
  waliKelasPath?: string;
  onEdit?: () => void; // Add onEdit callback
  onWaliKelas?: () => void;
  onRegisterFace?: () => void;
}

export const BaseActionTable = React.memo((props: BaseActionTableProps) => {
  const profile = useProfile();
  const isRoleTeacher = profile?.user?.role === "guru";
  const [loadingRegisterFace, setLoadingRegisterFace] = useState(false);
  const [openDialogRegister, setOpenDialogRegister] = useState(false);
  const [fotoTampakDepan, setFotoTampakDepan] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";
  const alert = useAlert();
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

      alert.success("Register face berhasil");

      setOpenDialogRegister(false);
      setFotoTampakDepan(null);
      setPreviewImage("");
    } catch (error: any) {
      alert.error(error?.message);
    } finally {
      setLoadingRegisterFace(false);
    }
  };
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await studentService.getAll();
      setStudents(res);
    };

    fetchData();
  }, []);

  const fileRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {props.detailPath && (
            <DropdownMenuItem asChild>
              <Link to={props.detailPath}>{lang.text("seeDetails")}</Link>
            </DropdownMenuItem>
          )}
          {props.editPath && (
            <DropdownMenuItem asChild>
              <Link to={props.editPath}>{lang.text("edit")}</Link>
            </DropdownMenuItem>
          )}
          {props.onEdit && (
            <DropdownMenuItem onClick={props.onEdit}>
              {lang.text("edit")}
            </DropdownMenuItem>
          )}
          {props.deletePath && (
            <DropdownMenuItem asChild>
              <Link to={props.deletePath}>{lang.text("delete")}</Link>
            </DropdownMenuItem>
          )}

          {props.onWaliKelas && (
            <DropdownMenuItem onClick={props.onWaliKelas}>
              Wali Kelas
            </DropdownMenuItem>
          )}
          {props.onRegisterFace && (
            <DropdownMenuItem onClick={props.onRegisterFace}>
              {lang.text("RegisterFace")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
              <label className="text-black text-md font-semibold mb-2 flex items-center gap-2 mb-2">
                {lang.text("UploadPicture")}
              </label>
              <div className="relative">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFotoTampakDepan(file);

                    if (file) setPreviewImage(URL.createObjectURL(file));
                  }}
                />

                <Box mt={2}>
                  <Button
                    onClick={() => fileRef.current?.click()}
                    style={{ width: "100%", marginBottom: "10px" }}
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
