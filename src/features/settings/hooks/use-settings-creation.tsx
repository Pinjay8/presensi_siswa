import { SettingsUpdateModel } from "@/core/models";
import { settingsService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";

// export const useSettingsUpdate = () => {
//     const updateMutation = useMutation({
//         mutationFn: (vars: {payload: SettingsUpdateModel }) =>
//             settingsService.update(vars.payload),
//     });

//     const update = (payload: SettingsUpdateModel) => 
//         updateMutation.mutateAsync({ payload });

//     const isLoading = updateMutation.isPending;

//     return{
//         isLoading,
//         update,
//     };
// };

export const useSettings = () => {
    const auth = useAuth();
    const profile = useProfile();
    const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

    const schoolId = profile.user?.sekolah?.id;

    const query = useQuery({
        enabled,
        queryKey: ["settings", schoolId],
        queryFn: () => settingsService.get(),
    })

    const updateMutation = useMutation({
        mutationFn: (vars: {payload: SettingsUpdateModel }) =>
            settingsService.update(vars.payload),
    });

    const update = (payload: SettingsUpdateModel) =>
        updateMutation.mutateAsync({ payload });

    const data = query.data?.data;
    // console.log("Data Setting", data)
    const isLoading = query.isLoading || updateMutation.isPending;

    return {
        data,
        isLoading,
        update,
    }
}