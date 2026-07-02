import { courseService, scheduleService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

interface UseMapelProps {
  kelasId?: number;
  search?: string;
}

export const useMapel = ({ kelasId, search }: UseMapelProps = {}) => {
  const auth = useAuth();
  const profile = useProfile();

  const query = useQuery({
    enabled: auth.isAuthenticated() && Boolean(profile.user?.id),
    queryKey: ["mapel-kelas", kelasId, search],
    queryFn: async () => {
      const res = await courseService.getMapelKelaas({
        kelasId,
        search,
      });

      return res;
    },
    staleTime: 60 * 1000,
    gcTime: 60 * 1000,
  });

  return {
    query,
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
  };
};
