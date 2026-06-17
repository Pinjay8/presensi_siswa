import { classroomService } from "@/core/services/classroom";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";

type Props = {
  classroomId: number;
  page?: number;
  limit?: number;
  search?: string;
};

export const useClassroomStudentsPaginated = ({
  classroomId,
  page = 1,
  limit = 10,
  search,
}: Props) => {
  const auth = useAuth();
  const profile = useProfile();

  const query = useQuery({
    enabled:
      auth.isAuthenticated() &&
      Boolean(profile.user?.id) &&
      Boolean(classroomId),
    queryKey: ["classroom-students", classroomId, page, limit, search],
    queryFn: () =>
      classroomService.getStudents(classroomId, {
        page,
        limit,
        search,
      }),
  });

  return {
    query,
    data: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading || query.isFetching || query.isPending,
  };
};
