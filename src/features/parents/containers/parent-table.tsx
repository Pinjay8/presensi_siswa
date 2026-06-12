import { useBiodata, useUserCreation } from "@/features/user/hooks";
import { parentColumnWithFilter } from "../utils";
import { BaseDataTable, useAlert } from "@/features/_global";
import { distinctObjectsByProperty } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useEffect, useMemo, useState } from "react";
import { useParent } from "../hooks";
import { useNavigate } from "react-router-dom";
import { lang } from "@/core/libs";
import { ModalCreateParents } from "../components/ModalCreateParents";
import { useProfile } from "@/features/profile";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FaPlus } from "react-icons/fa";
export function ParentTable() {
  const alert = useAlert();
  const parent = useParent();

  const student = useBiodata();
  const navigate = useNavigate();
  const school = useSchool();
  const userDelete = useUserCreation();

  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (parent: any) => {
    setSelectedParent(parent);
    setOpenDeleteDialog(true);
  }

  const columns = useMemo(() => {
    return parentColumnWithFilter({
      columnFilter: {
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      },
      onDelete: handleOpenDeleteDialog,
    });
  }, [school.data]);

  const biodataStudents = useMemo(() => {
    try {
      return typeof student.data === "string"
        ? JSON.parse(student.data)
        : student.data || [];
    } catch (error) {
      console.error("Failed parse biodata", error);
      return [];
    }
  }, [student.data]);

  const datas = useMemo(() => {
    return parent.data?.map((d) => {
      return {
        ...d,
        student: biodataStudents?.find((e: any) =>
          Boolean(e.orangTua?.find((f: any) => f.user?.nik === d.nik)),
        ),
        school: school?.data?.find((e) => Number(e.id) === Number(d.sekolahId)),
      };
    });
  }, [parent.data, student.data, school.data]);

  const [parents, setParents] = useState(false);

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "guru" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  async function handleDelete() {
    try {
      await userDelete.deleteUser(Number(selectedParent?.id));
      alert.success(lang.text("successDelete"));
      parent.query.refetch();
      setOpenDeleteDialog(false);
      setSelectedParent(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  return (
    <>
      {
        <ModalCreateParents
          show={parents}
          onClose={() => setParents(!parents)}
        />
      }
      <BaseDataTable
        columns={columns}
        data={datas}
        dataFallback={[]}
        globalSearch
        initialState={{
          sorting: [{ id: "name", desc: false }],
        }}
        actions={[
          ...(!isRole
            ? [
                {
                  title: lang.text("createParent"),
                  icon: <FaPlus />,
                  onClick: () => navigate("/parents/create"),
                },
              ]
            : []),
        ]}
        searchParamPagination
        showFilterButton
        searchPlaceholder={lang.text("search")}
        isLoading={
          parent.query.isLoading || student.isLoading || school.isLoading
        }
      />

      
      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>{lang.text("delete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {lang.text("deleteMessage", { context: selectedParent?.user_name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>{lang.text("cancel")}</Button>
          <Button onClick={handleDelete} disabled={userDelete.isLoading}>{lang.text("delete")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
