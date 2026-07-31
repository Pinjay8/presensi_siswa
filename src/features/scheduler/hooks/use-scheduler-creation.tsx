import { SchedulerCreationModel } from "@/core/models";
import { GetSchedulerParams, schedulerService } from "@/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";
import { lang } from "@/core/libs";

export const useSchedulerCreation = (
    params: GetSchedulerParams = {},
) => {
    const auth = useAuth();
    const profile = useProfile();
    const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

    // const schoolId = profile.user?.sekolah?.id;

    // const query = useQuery({
    //     enabled,
    //     queryKey: ["schedulers", schoolId],
    //     queryFn: () => schedulerService.all(),
    // })


    // const enabled =
    //     auth.isAuthenticated() &&
    //     Boolean(profile.user?.id);

    const schoolId = profile.user?.sekolah?.id;

    const query = useQuery({
        enabled,
        queryKey: [
            "schedulers",
            schoolId,
            params.page,
            params.limit,
            params.search,
            params.sortBy,
            params.sortOrder,
            params,
        ],
        queryFn: () => schedulerService.getPaginated(params),
    });

    const queryClient = useQueryClient();

    // CREATE
    const createMutation = useMutation({
        mutationFn: (vars: { payload: SchedulerCreationModel }) =>
            schedulerService.create(vars.payload),
        onSuccess: () => {
            toast.success("Data berhasil ditambahkan!");
            query.refetch();
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menambahkan data");
        }
    });

    const create = (payload: SchedulerCreationModel) =>
        createMutation.mutateAsync({ payload });

    const updateMutation = useMutation({
        mutationFn: (vars: { id: number, payload: SchedulerCreationModel }) =>
            schedulerService.update(vars.id, vars.payload),

        onSuccess: async () => {
            toast.success(lang.text("scheduleSuccessUpdate"));
            query.refetch();
            await queryClient.invalidateQueries({
                queryKey: ["schedulers"],
            });
        },
        onError: (error) => {
            toast.error(error.message || "Gagal memperbarui data");
        }
    });

    const update = (id: number, payload: SchedulerCreationModel) => {
        updateMutation.mutateAsync({ id, payload });
    }

    const deleteMutation = useMutation({
        mutationFn: (vars: { id: number }) =>
            schedulerService.delete(vars.id),
        onSuccess: async () => {
            toast.success("Data berhasil dihapus!");
            query.refetch();
            await queryClient.invalidateQueries({
                queryKey: ["schedulers"],
            });
        },
        onError: (error) => {
            toast.error(error.message || "Gagal menghapus data");
        }
    });

    const deleteScheduler = (id: number) =>
        deleteMutation.mutateAsync({ id });

    const data = useMemo(
        () => query.data?.data ?? [],
        [query.data],
    );

    const pagination = useMemo(
        () => query.data?.pagination,
        [query.data],
    );

    const isLoading =
        query.isLoading ||
        query.isFetching ||
        query.isPending ||
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending;

    return {
        query,
        data,
        pagination,
        isLoading,
        create,
        update,
        deleteScheduler,
    };
}