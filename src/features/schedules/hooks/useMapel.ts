import { courseService, scheduleService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useMapel = () => {
  const auth = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled: true,
    queryKey: ["mapel-kelas"],
    queryFn: async () => {
      const res = await courseService.getMapelKelaas();
      return res;
    },
    staleTime: 1 * 60 * 1000, // 5 minutes
    gcTime: 1 * 60 * 1000, // 10 minutes
  });

  const data = useMemo(() => {
    return query.data?.data;
  }, [query.data?.data]);
  const isLoading = query.isLoading;

  return {
    query,
    data,
    isLoading,
  };
};
