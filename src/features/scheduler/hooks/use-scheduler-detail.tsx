import { schedulerService } from "@/core/services/scheduler";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface useSchedulerDetailProps {
  id: number;
}

export const useSchedulerDetail = (props?: useSchedulerDetailProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(props?.id);

  const query = useQuery({
    enabled,
    queryKey: ["scheduler-detail", { id: props?.id }],
    queryFn: () => schedulerService.get(Number(props?.id)),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};