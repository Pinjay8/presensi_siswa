import { BaseDataTables } from "@/features/_global/components/base-data-tables";
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
import { useAlert, useParamDecode } from "@/features/_global";
import { lang } from "@/core/libs";
import { useCardAssign } from "../hooks/useUnassignCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardsService } from "@/core/services/cards";
import AssignCardDialog from "../components/AsssignCardDialog";
import UnassignCardDialog from "../components/UnassignCardDialog";

interface StudentTableProps {
  data: any[];
  isLoading: boolean;
  refetch: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (newPage: number) => void;
    onSizeChange: (newSize: number) => void;
  };
  sorting: any[];
  onSortingChange: (sort: any[]) => void;
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
  sorting,
  onSortingChange,
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

  const handleSubmitRegisterFace = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("fotoTampakDepan", file);
      formData.append("userId", String(selectedStudent.id));

      await userService.registerFace(formData);

      alert.success(lang.text("successRegister"));
    } catch (error: any) {
      alert.error(error?.message || "Gagal mendaftarkan wajah");
    }
  };

  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        schoolOptions,
        classroomOptions,
        handleAttend,
        onRegisterFace: handleOpenRegisterFace,
        onAssignCard: handleOpenAssignCard,
        unAssignCard: handleOpenUnassignCard,
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

  return (
    <>
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch
        searchParamPagination
        showFilterButton
        isLoading={isLoading}
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
        schoolOptions={schoolOptions}
        classroomOptions={classroomOptions}
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
    </>
  );
}
