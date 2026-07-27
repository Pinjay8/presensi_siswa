
import {
  useAttendanceActions,
  useStudentDetail,
} from "@/features/student/hooks"; // Impor custom hook
import { useMemo, useState } from "react";
import {
  useClassroomOptions,
  useSchoolOptions,
} from "../hooks/use-format-school-class";
import { studentColumnWithFilter } from "../utils";
import { userService } from "@/core/services";
import RegisterFaceDialog from "@/features/_global/components/dashboard/usermenu/components/RegisterFaceDialog";
import { BaseDataTable, useAlert, useParamDecode } from "@/features/_global";
import { lang } from "@/core/libs";
import { useCardAssign } from "../hooks/useUnassignCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardsService } from "@/core/services/cards";
import AssignCardDialog from "../components/AsssignCardDialog";
import UnassignCardDialog from "../components/UnassignCardDialog";
import { useUserCreation } from "@/features/user/hooks";
import { cdnService } from "@/core/services/cdn";
import { DeleteDialog } from "@/features/cards/components/DeleteCardDialog";

interface StudentTableProps {
  data: any;
  isLoading: boolean;
  refetch: () => void;
  pagination: any;
  onPaginationChange: any;
  rowCount: number;
}

export const useAssignCard = () => {
  const mutation = useMutation({
    mutationFn: ({ cardId, userId }: { cardId: number; userId: number }) =>
      cardsService.assign(cardId, { userId }),
  });

  return mutation;
};

export const useUnassignCard = () => {
  const unassignMutation = useMutation({
    mutationFn: (cardId: number) => cardsService.unassign(cardId),
  });

  return unassignMutation;
};

export function StudentTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
  rowCount,
  refetch,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttend } = useAttendanceActions();
  const [openRegisterFace, setOpenRegisterFace] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const alert = useAlert();
  const [openUnassignCard, setOpenUnassignCard] = useState(false);
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const userCards = selectedUser?.kartus || [];

  const handleOpenRegisterFace = (student: any) => {
    setSelectedStudent(student);
    setOpenRegisterFace(true);
  };

  const handleOpenAssignCard = (studentId: number) => {
    setSelectedStudentId(studentId);
    setOpenAssignCard(true);
  };

  const handleOpenUnassignCard = (user: any) => {
    setSelectedUser(user);
    setOpenUnassignCard(true);
  };

  const handleOpenDeleteDialog = (student: any) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const uploadFormData = new FormData();

      uploadFormData.append("file", file);

      const uploadResponse = await cdnService.uploadFile(uploadFormData);

      const fileUrl = uploadResponse?.collection?.data?.[0]?.fileUrl;

      await userService.registerFace({
        userId: Number(selectedStudent.id),
        fotoTampakDepan: fileUrl,
      });

      await queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      alert.success(lang.text("successRegister"));
    } catch (error: any) {
      alert.error(error?.message || lang.text("failedRegisterFace"));
    }
  };

  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        handleAttend,
        onRegisterFace: handleOpenRegisterFace,
        onAssignCard: handleOpenAssignCard,
        unAssignCard: handleOpenUnassignCard,
        onDelete: handleOpenDeleteDialog,
        schoolOptions: schoolOptions,
        classroomOptions: classroomOptions,
      }),
    [schoolOptions, classroomOptions],
  );

  const [openAssignCard, setOpenAssignCard] = useState(false);

  const { data: assignList, isLoading: isLoadingAssign } = useCardAssign();

  const assignMutation = useAssignCard();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [unassignCardId, setUnassignCardId] = useState<number | null>(null);

  const handleAssign = async () => {
    if (!selectedCardId || !selectedStudentId) {
      alert.error("Card harus diisi");
      return;
    }

    try {
      await assignMutation.mutateAsync({
        cardId: selectedCardId,
        userId: selectedStudentId,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["card-assign"],
        }),
        await queryClient.refetchQueries({
          queryKey: ["studentsPaginated"],
        }),
      ]);
      refetch();
      alert.success(lang.text("successAssignCard"));

      setOpenAssignCard(false);
      setSelectedCardId(null);
    } catch (err: any) {
      alert.error(err?.message);
    }
  };

  const unassignMutation = useUnassignCard();

  const handleUnassign = async () => {
    if (!unassignCardId) {
      alert.error("Pilih card terlebih dahulu");
      return;
    }

    try {
      await unassignMutation.mutateAsync(unassignCardId);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["card-assign"],
        }),
        await queryClient.refetchQueries({
          queryKey: ["studentsPaginated"],
        }),
      ]);
      refetch();
      alert.success(lang.text("successUnassignCard"));

      setOpenUnassignCard(false);
      setUnassignCardId(null);
    } catch (err: any) {
      alert.error(err?.message || "Gagal unassign card");
    }
  };

  const userDelete = useUserCreation();

  async function handleDelete() {
    try {
      await userDelete.deleteUser(Number(selectedStudent?.id));
      alert.success(lang.text("successDelete"));
      refetch();
      setOpenDeleteDialog(false);
      setSelectedStudent(null);
    } catch (error: any) {
      alert.error(lang.text("failedDelete"));
    }
  }

  return (
    <>
      <BaseDataTable
        columns={columns}
        data={data}
        globalSearch
        dataFallback={columns}
        // searchParamPagination
        searchPlaceholder={lang.text("search") + " " + lang.text("student")}
        searchParamPagination
        showFilterButton
        isLoading={isLoading}
        manualPagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        rowCount={rowCount}
      />

      <RegisterFaceDialog
        open={openRegisterFace}
        onClose={() => setOpenRegisterFace(false)}
        onSubmit={handleSubmitRegisterFace}
      />
      <AssignCardDialog
        open={openAssignCard}
        onClose={() => setOpenAssignCard(false)}
        assignList={assignList || []}
        isLoading={isLoadingAssign}
        selectedCardId={selectedCardId}
        setSelectedCardId={setSelectedCardId}
        onAssign={handleAssign}
        isAssigning={assignMutation.isPending}
        lang={lang}
      />

      <UnassignCardDialog
        open={openUnassignCard}
        onClose={() => setOpenUnassignCard(false)}
        userCards={userCards}
        isLoading={isLoadingAssign}
        unassignCardId={unassignCardId}
        setUnassignCardId={setUnassignCardId}
        onUnassign={handleUnassign}
        isUnassigning={unassignMutation.isPending}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={userDelete.isLoading}
        message={lang.text("deleteMessage", { context: lang.text("student") })}
      />
    </>
  );
}
