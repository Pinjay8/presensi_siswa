import { UserCreationModel } from "@/core/models";
import { userService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useUserCreation = () => {
  const createMutation = useMutation({
    mutationFn: (payload: UserCreationModel) =>
      userService.createTeacher(payload),
  });

  const createMutationParents = useMutation({
    mutationFn: (payload: UserCreationModel) =>
      userService.createParents(payload),
  });

  const create = (payload: UserCreationModel) =>
    createMutation.mutateAsync(payload);

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
      userService.updateUser(vars.id, vars.payload),
  });


  const updateParentsMutation = useMutation({
    mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
      userService.updateParents(vars.id, vars.payload),
  });

  const update = (id: number, payload: UserCreationModel) =>
    updateMutation.mutateAsync({ id, payload });



  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
  })

  const deleteUser = (id: number) => deleteMutation.mutateAsync(id);

  // const updateMutationTeacher = useMutation({
  //   mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
  //     userService.updateTeacher(vars.id, vars.payload),
  // });

  // const updateTeacher = (id: number, payload: UserCreationModel) =>
  //   updateMutationTeacher.mutateAsync({ id, payload });
  const isLoading = updateMutation.isPending || deleteMutation.isPending;
  return {
    isLoading,
    update,
    create,
    createParents: createMutationParents.mutateAsync,
    updateParents: updateParentsMutation.mutateAsync,
    deleteUser,
  };
};
