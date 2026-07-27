import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { courseService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";

interface UseCoursePaginationProps {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export const useCoursePagination = (
  params: UseCoursePaginationProps = {},
) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled =
    auth.isAuthenticated() &&
    Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: [
      "courses",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
      params,
    ],
    queryFn: () => courseService.getPaginated(params),
  });

  return {
    query,
    data: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading:
      query.isLoading ||
      query.isFetching ||
      query.isPending,
  };
};