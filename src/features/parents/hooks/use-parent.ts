import { userService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useParent = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);
  const schoolId = profile.user?.sekolah?.id;

  const query = useQuery({
    enabled,
    queryKey: ["parents"],
    queryFn: () => userService.getParents(),
  });

  const data = useMemo(() => {
    if (!schoolId) return query.data?.data || [];
    return (
      query.data?.data?.filter(
        (d) => Number(d.sekolahId) === Number(schoolId),
      ) || []
    );
  }, [query.data?.data, schoolId]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
