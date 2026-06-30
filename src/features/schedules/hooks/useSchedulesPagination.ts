import { scheduleService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseSchedulesPaginationProps {
  page: number;
  limit: number;
  kelasId?: number;
}

export const useSchedulesPagination = ({
  page,
  limit,
  kelasId,
}: UseSchedulesPaginationProps) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled: !!kelasId,
    queryKey: ["schedules", page, limit, kelasId],
    queryFn: () =>
      scheduleService.getPaginated({
        page,
        limit,
        kelasId,
      }),
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });

  const data = useMemo(() => {
    return query.data?.data ?? [];
  }, [query.data]);

  const pagination = useMemo(() => {
    return query.data?.pagination;
  }, [query.data]);

  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    pagination,
    isLoading,
  };
};
