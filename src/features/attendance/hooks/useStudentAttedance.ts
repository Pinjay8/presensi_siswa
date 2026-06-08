import { StudentPaginationResponse } from "@/core/models/pagination";
import {
  attendanceService,
  GetPaginatedStudentParams,
  studentService,
} from "@/core/services/pagination";
import { useQuery } from "@tanstack/react-query";

export const useStudentAttendance = (params: any) => {
  return useQuery<any, Error>({
    queryKey: ["studentsPaginated", params],
    queryFn: () => attendanceService.getPaginated(params),
    // keepPreviousData: true,
    enabled: !!params.page && !!params.limit, 
  });
};
