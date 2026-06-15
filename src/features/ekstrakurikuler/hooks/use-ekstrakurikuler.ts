import { courseService } from "@/core/services";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useEkstrakurikuler = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["ekstrakurikuler"],
    queryFn: () => ekstrakurikulerService.all(),
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
