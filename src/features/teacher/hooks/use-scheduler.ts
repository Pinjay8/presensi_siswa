
import { schedulerService } from "@/core/services/scheduler";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useScheduler = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["scheduler-all"],
    queryFn: () => schedulerService.all({}),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;
    

    const assignMutation = useMutation({
        mutationFn: (vars: { id: number; guru_id: number }) => schedulerService.assignGuru(vars.id, vars.guru_id),
    });
    
    const assign = (form: { id: number; guru_id: number }) =>
        assignMutation.mutateAsync(form);
        
    return {
        assign,
        isPending: assignMutation.isPending,
        data,
        isLoading,
    };
}