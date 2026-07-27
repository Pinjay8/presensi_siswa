import { classroomService } from "@/core/services/classroom";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useClassroomPaginated = ({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
}: Props) => {
  const auth = useAuth();
  const profile = useProfile();

  const query = useQuery({
    enabled: auth.isAuthenticated() && Boolean(profile.user?.id),
    queryKey: ["classrooms-paginated", page,
      limit,
      search,
      sortBy,
      sortOrder],
    queryFn: () =>
      classroomService.getPaginated({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      }),
  });

  return {
    query,
    data: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading || query.isFetching || query.isPending,
  };
};
