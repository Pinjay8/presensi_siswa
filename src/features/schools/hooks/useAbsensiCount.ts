import { dashboardService } from "@/core/services/dashboard";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
export const useAbsensiCount = () => {
  const auth = useAuth();
  const enabled = auth.isAuthenticated();
  return useQuery({
    enabled,
    queryKey: ["absensi-count"],
    queryFn: async () => {
      const response = await dashboardService.getAbsensiCount();
      return response.data;
    },
  });
};
