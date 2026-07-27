import { biodataService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useBiodataGuru = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["biodata-guru"],
    queryFn: () => biodataService.guru(),
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  const memberOptions: never[] = [];

  return {
    query,
    data,
    memberOptions,
    isLoading,
  };
};


export const useBiodataGuruById = (userId?: number) => {
  const query = useQuery({
    enabled: !!userId,
    queryKey: ["biodata-guru", userId],
    queryFn: () => biodataService.getGuruById(userId!),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);

  const isLoading =
    query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};

interface BiodataGuruParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const useBiodataGuruPaginated = (
  params: BiodataGuruParams,
) => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled =
    auth.isAuthenticated() &&
    Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: [
      "biodata-guru",
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
      params,
    ],
    queryFn: () => biodataService.getGuruPaginated(params),
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