import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEkstrakurikulerCreation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (vars: any) => ekstrakurikulerService.create(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ekstrakurikuler"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: any }) =>
      ekstrakurikulerService.update(vars.id, vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ekstrakurikuler"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: number }) =>
      ekstrakurikulerService.delete(vars.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ekstrakurikuler"],
      });
    },
  });

  const create = (form: any) => createMutation.mutateAsync(form);

  const update = (id: number, payload: any) =>
    updateMutation.mutateAsync({ id, payload });

  const remove = (id: number) =>
    deleteMutation.mutateAsync({ id });

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