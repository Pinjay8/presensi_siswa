import { schoolService } from "@/core/services";
import { dashboardService } from "@/core/services/dashboard";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// export interface UseSchoolDetailProps {
//   id: string | number;
// }

export const useDashboardSchool = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["dashboard-school"],
    queryFn: () => dashboardService.getSchoolDetails(),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
