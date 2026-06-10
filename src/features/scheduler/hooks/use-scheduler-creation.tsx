import { SchedulerCreationModel } from "@/core/models";
import { schedulerService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSchedulerCreation = () => {
    const auth = useAuth();
    const profile = useProfile();
    const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

        const schoolId = profile.user?.sekolah?.id;
    
        const query = useQuery({
            enabled,
            queryKey: ["schedulers", schoolId],
            queryFn: () => schedulerService.all(),
        })

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
            onSuccess: () => {
                toast.success("Data berhasil diperbarui!");
                query.refetch();
            },
            onError: (error) => {
                toast.error(error.message || "Gagal memperbarui data");
            }
        });

        const update = (id: number, payload: SchedulerCreationModel) =>
            updateMutation.mutateAsync({ id, payload });

        const deleteMutation = useMutation({
            mutationFn: (vars: { id: number }) =>
                schedulerService.delete(vars.id),
            onSuccess: () => {
                toast.success("Data berhasil dihapus!");
                query.refetch();
            },
            onError: (error) => {
                toast.error(error.message || "Gagal menghapus data");
            }
        });

        const destroy = (id: number) =>
            deleteMutation.mutateAsync({ id });

        const data = query.data?.data;
        const isLoading = query.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
        
        return {
            data,
            isLoading,
            create,
            update,
            destroy,
        }
}