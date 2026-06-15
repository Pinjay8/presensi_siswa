import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useEkstrakurikuler = (params: any) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["ekstrakurikuler"],
    queryFn: () => ekstrakurikulerService.getPaginated(params),
  });

  return {
    query,
    data: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading || query.isFetching || query.isPending,
  };
};
