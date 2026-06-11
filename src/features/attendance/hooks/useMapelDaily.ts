import { attendanceService } from "@/core/services/attedance";
import { useQuery } from "@tanstack/react-query";

export const useMapelDaily = (params: any) => {
  return useQuery<any, Error>({
    queryKey: ["mapel-harian", params],
    queryFn: () => attendanceService.getMapelHarian(params),
    enabled: !!params.page && !!params.limit,
  });
};
