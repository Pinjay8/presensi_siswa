import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable, useAlert, useDataTableController } from "@/features/_global";
import { distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo, useState } from "react";
// import { teacherColumnWithFilter } from "../utils";
import { useNavigate } from "react-router-dom";
// import { ModalCreateTeacher } from "../components/ModalCreateTeacher";
import { useProfile } from "@/features/profile";
import { FaPlus } from "react-icons/fa";
import { ModalCreateLicensing } from "../components/ModalCreateLicensing";
import { useLicensing, useLicensingPaginated } from "../hooks/useLicensing";
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
  const {
    global,
    setGlobal,
    sorting,
    filter,
    setFilter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
    defaultSorting: [{ id: "updatedAt", desc: true }],
  });

  const params: any = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
    sortBy: sorting?.[0]?.id,
    sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
    ...filter,
  };

  const resource = useLicensingPaginated(params);
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

        sorting={sorting}
        onSortingChange={onSortingChange}

        pagination={pagination}
        onPaginationChange={onPaginationChange}

        globalFilter={global}
        onGlobalFilterChange={setGlobal}

        onFilterChange={setFilter}

        rowCount={resource.pagination?.total ?? 0}
        manualPagination

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
        isLoading={resource.isLoading}
        filters={[
          {
            id: "statusPengajuan",
            label: lang.text("statusLicensing"),
            variant: "select",
            options: [
              { label: lang.text("pending"), value: "pending" },
              { label: lang.text("approved"), value: "disetujui" },
              { label: lang.text("rejected"), value: "ditolak" },
            ],
          },
        ]}
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
