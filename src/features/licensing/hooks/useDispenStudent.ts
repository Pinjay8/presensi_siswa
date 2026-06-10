import { dispensasiService } from "@/core/services/dispensasi";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useDispenStudent = () => {
  const auth = useAuth();
  const profile: any = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    queryKey: ["dispensasi-student"],
    enabled,
    queryFn: async () => {
      const res = await dispensasiService.getDispensiStudent();
      return res;
    },
  });

  const data = useMemo(() => query.data?.data || [], [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
    refetch: query.refetch,
  };
};
