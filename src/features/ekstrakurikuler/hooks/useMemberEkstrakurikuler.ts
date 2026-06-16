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
}

export const useMemberEkstrakurikulerDetail = ({
  id,
  page,
  limit,
  search,
}: UseMemberEkstrakurikulerProps = {}) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(id);

  const query = useQuery({
    enabled,
    queryKey: ["member-ekstrakurikuler", id, page, limit, search],
    queryFn: () =>
      ekstrakurikulerService.getMember(Number(id), {
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { limit }),
        ...(search !== undefined && { search }),
      }),
  });

  const data = useMemo(() => query.data?.data ?? [], [query.data]);

  const pagination = useMemo(() => query.data?.pagination, [query.data]);

  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    pagination,
    isLoading,
  };
};
