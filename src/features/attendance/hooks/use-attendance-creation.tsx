import { attendanceCreationModel } from "@/core/models";
import { attendanceService } from "@/core/services/attedance";
import { useMutation } from "@tanstack/react-query";

export const useAttendanceCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.create(vars)
  });

  const create = (form: attendanceCreationModel) =>
    createMutation.mutateAsync(form);

  const isLoading =
    createMutation.isPending

  return {
    isLoading,
    create,
  };
};
