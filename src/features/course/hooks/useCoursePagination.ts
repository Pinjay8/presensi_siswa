import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { courseService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";

interface UseCoursePaginationProps {
  page?: number;
  limit?: number;
}

export const useCoursePagination = ({
  page = 1,
  limit = 10,
}: UseCoursePaginationProps = {}) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["courses", page, limit],
    queryFn: () =>
      courseService.getPaginated({
        page,
        limit,
      }),
  });

  const data = useMemo(() => query.data?.data ?? [], [query.data?.data]);

  const pagination = useMemo(
    () => query.data?.pagination,
    [query.data?.pagination],
  );

  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    pagination,
    isLoading,
  };
};
