import { schoolService } from "@/core/services/school";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSchools = () => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    queryKey: ["schools"],
    enabled,
    queryFn: async () => {
      const res = await schoolService.all();
      return res;
    },
  });

  const schools = useMemo(() => query.data?.data || [], [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    schools,
    isLoading,
  };
};
