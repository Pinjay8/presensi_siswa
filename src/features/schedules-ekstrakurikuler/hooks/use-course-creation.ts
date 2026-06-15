import { CourseCreationModel } from "@/core/models/course";
import { scheduleService } from "@/core/services";
import { scheduleEkstrakurikulerService } from "@/core/services/schedules-ekstrakurikuler";
import { useMutation } from "@tanstack/react-query";

export const useScheduleCreation = () => {
  // const createMutation = useMutation({
  //   mutationFn: (vars: any) => scheduleEkstrakurikulerService.create(vars as any),
  // });

  const createMutation = useMutation({
    mutationFn: ({ ekskulId, data }: { ekskulId: number; data: any }) =>
      scheduleEkstrakurikulerService.create(ekskulId, data),
  });

  // const updateMutation = useMutation({
  //   mutationFn: (vars: { id: number; payload: any }) =>
  //     scheduleEkstrakurikulerService.update(vars.id, vars.payload),
  // });

  const updateMutation = useMutation({
    mutationFn: ({
      ekskulId,
      jadwalId,
      payload,
    }: {
      ekskulId: number;
      jadwalId: number;
      payload: any;
    }) => scheduleEkstrakurikulerService.update(ekskulId, jadwalId, payload),
  });
  const deleteMutation = useMutation({
    mutationFn: ({
      ekskulId,
      jadwalId,
    }: {
      ekskulId: number;
      jadwalId: number;
    }) => scheduleEkstrakurikulerService.delete(ekskulId, jadwalId),
  });

  const create = (form: any) => createMutation.mutateAsync(form);

  const update = (ekskulId: number, jadwalId: number, payload: any) =>
    updateMutation.mutateAsync({
      ekskulId,
      jadwalId,
      payload,
    });

  const remove = (ekskulId: number, jadwalId: number) =>
    deleteMutation.mutateAsync({
      ekskulId,
      jadwalId,
    });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    isLoading,
    create,
    update,
    delete: remove,
  };
};
