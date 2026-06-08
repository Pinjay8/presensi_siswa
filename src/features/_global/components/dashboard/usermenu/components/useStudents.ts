import { studentService } from "@/core/services/pagination";
import { useQuery } from "@tanstack/react-query";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.getAll(),
  });
};
