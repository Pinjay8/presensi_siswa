import { CourseCreationModel } from "@/core/models/course";
import { courseService } from "@/core/services";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useMutation } from "@tanstack/react-query";

export const useEkstrakurikulerCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: any) => ekstrakurikulerService.create(vars),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: any }) =>
      ekstrakurikulerService.update(vars.id, vars.payload),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: number }) => ekstrakurikulerService.delete(vars.id),
  });

  const create = (form: any) => createMutation.mutateAsync(form);

  const update = (id: number, payload: any) =>
    updateMutation.mutateAsync({ id, payload });

  const remove = (id: number) => deleteMutation.mutateAsync({ id });

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
