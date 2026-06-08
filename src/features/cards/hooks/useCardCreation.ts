import { UserCreationModel } from "@/core/models";
import { userService } from "@/core/services";
import { cardsService } from "@/core/services/cards";
import { useMutation } from "@tanstack/react-query";

export const useCardCreation = () => {
  const createMutation = useMutation({
    mutationFn: (payload: any) => cardsService.create(payload),
  });

  const create = (payload: any) => createMutation.mutateAsync(payload);

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: any }) =>
      cardsService.update(vars.id, vars.payload),
  });

  const update = (id: number, payload: any) =>
    updateMutation.mutateAsync({ id, payload });

  const isLoading = updateMutation.isPending;

  const deleteData = (id: number) => cardsService.delete(id);




  
  return {
    isLoading,
    update,
    create,
    deleteData
  };
};
