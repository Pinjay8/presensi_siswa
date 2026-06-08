import {
  attendanceService,
  attendanceServiceMataPelajaran,
  GetPaginatedStudentParams,
  studentService,
} from "@/core/services/pagination";
import { useQuery } from "@tanstack/react-query";

export const useMapelAttedance = (params: any) => {
  return useQuery<any, Error>({
    queryKey: ["mapelPagianted", params],
    queryFn: () => attendanceServiceMataPelajaran.getPaginated(params),
    // keepPreviousData: true,
    enabled: !!params.page && !!params.limit,
  });
};
