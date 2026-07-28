import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";



export interface UseMemberEkstrakurikulerProps {
  id?: number;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  [key: string]: any;
}

export const useMemberEkstrakurikulerDetail = (
  params: UseMemberEkstrakurikulerProps = {},
) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled =
    auth.isAuthenticated() &&
    Boolean(profile.user?.id) &&
    Boolean(params.id);

  const query = useQuery({
    enabled,
    queryKey: ["member-ekstrakurikuler", params],
    queryFn: () =>
      ekstrakurikulerService.getMember(
        Number(params.id),
        params,
      ),
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