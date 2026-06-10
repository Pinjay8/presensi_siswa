import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable, useAlert } from "@/features/_global";
import { distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
// import { teacherColumnWithFilter } from "../utils";
import { useNavigate } from "react-router-dom";
// import { ModalCreateTeacher } from "../components/ModalCreateTeacher";
import { useProfile } from "@/features/profile";
import { useClassroom } from "@/features/classroom";
import { teacherService } from "@/core/services/teacher";
import { useMutation } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { ModalCreateLicensing } from "../components/ModalCreateLicensing";
import { useLicensing } from "../hooks/useLicensing";
import { licensingColumns } from "../utils/table-column";
import { dispensasiService } from "@/core/services/dispensasi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import { XIcon } from "lucide-react";

export function LicensingTable() {
  const navigate = useNavigate();
  const resource = useLicensing();
  const alert = useAlert();
  const profile = useProfile();
  const isRole = profile?.user?.role === "orangTua";
  const isRoleTeacher = profile?.user?.role === "guru";

  const [rejectDialog, setRejectDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const openRejectDialog = (id: number) => {
    setSelectedId(id);
    setRejectDialog(true);
  };

  const handleApprove = async (id: number) => {
    try {
      await dispensasiService.approve(id);
      alert.success(lang.text("licensingApproveSuccess"));
      resource.refetch();
    } catch (error: any) {
      alert.error(error?.message);
    }
  };

  const handleSubmitReject = async () => {
    try {
      if (!selectedId) return;

      await dispensasiService.reject(selectedId, {
        catatanPenolakan: note,
      });

      alert.success(lang.text("licensingRejectSuccess"));

      setRejectDialog(false);
      setSelectedId(null);
      setNote("");

      resource.refetch();
    } catch (error: any) {
      alert.error(error?.message);
    }
  };

  const columns = useMemo(
    () =>
      licensingColumns({
        onApprove: handleApprove,
        onReject: openRejectDialog,
        isRoleTeacher,
      }),
    [isRoleTeacher],
  );

  const [teacher, setTeacher] = useState(false);

  return (
    <>
      {
        <ModalCreateLicensing
          show={teacher}
          onClose={() => setTeacher(!teacher)}
        />
      }

      <BaseDataTable
        columns={columns}
        data={resource.data}
        dataFallback={columns}
        globalSearch
        searchParamPagination
        showFilterButton
        actions={[
          ...(isRole
            ? [
                {
                  title: lang.text("addLicensing"),
                  icon: <FaPlus />,
                  onClick: () => navigate("/licensing/create"),
                },
              ]
            : []),
        ]}
        searchPlaceholder={lang.text("search")}
        isLoading={resource.query.isLoading}
      />
      <Dialog
        open={rejectDialog}
        onClose={() => setRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {lang.text("rejectTitle")}
          <IconButton
            onClick={() => {
              setRejectDialog(false);
              setSelectedId(null);
              setNote("");
            }}
          >
            <XIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={lang.text("rejectNote")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setRejectDialog(false)}
          >
            {lang.text("cancel")}
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmitReject}
            disabled={!note.trim()}
          >
            {lang.text("reject")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
