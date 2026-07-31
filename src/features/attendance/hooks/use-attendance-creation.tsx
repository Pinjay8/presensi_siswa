import { attendanceCreationModel } from "@/core/models";
import { attendanceService } from "@/core/services/attedance";
import { useMutation } from "@tanstack/react-query";

export const useAttendanceCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.create(vars)
  });

  const createPulangMutation = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.createPulang(vars)
  });

  const create = (form: attendanceCreationModel) =>
    createMutation.mutateAsync(form);

  const createPulang = (form: attendanceCreationModel) =>
    createPulangMutation.mutateAsync(form);


  const isLoading =
    createMutation.isPending || createPulangMutation.isPending;

  return {
    isLoading,
    create,
    createPulang
  };
};
